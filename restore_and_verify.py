#!/usr/bin/env python3
"""
restore_and_verify.py

Restore the latest DB backup (db_backup_*.npy) to `db.npy` and `clean_db.npy`,
then run the project's verification smoke-test (`test_matching.py`).

Usage: python restore_and_verify.py
"""
import glob
import os
import numpy as np
import time
import runpy
import argparse

PROJECT_ROOT = os.path.dirname(__file__)
BACKUP_GLOB = os.path.join(PROJECT_ROOT, "db_backup_*.npy")


def find_latest_backup():
    files = glob.glob(BACKUP_GLOB)
    if not files:
        return None
    files.sort(key=os.path.getmtime, reverse=True)
    return files[0]


def restore_backup(path):
    data = np.load(path, allow_pickle=True).item()
    np.save(os.path.join(PROJECT_ROOT, "db.npy"), data)
    # Also restore clean_db for compatibility
    np.save(os.path.join(PROJECT_ROOT, "clean_db.npy"), data)
    return True


def run_test_matching():
    # Prefer running the test module so it prints to stdout
    test_path = os.path.join(PROJECT_ROOT, "test_matching.py")
    if os.path.exists(test_path):
        print("Running test_matching.py...")
        runpy.run_path(test_path, run_name="__main__")
    else:
        print("test_matching.py not found; skipping runtime verification.")


def main(argv=None):
    p = argparse.ArgumentParser()
    p.add_argument("--yes", "-y", action="store_true", help="Auto-confirm restore without prompt")
    args = p.parse_args(argv)

    print("Looking for DB backups...")
    latest = find_latest_backup()
    if not latest:
        print("No backups found (db_backup_*.npy). Nothing to restore.")
        return

    print(f"Latest backup: {os.path.basename(latest)}")
    if not args.yes:
        confirm = input("Restore this backup and run verification? [y/N]: ").strip().lower()
        if confirm not in ("y", "yes"):
            print("Aborted by user.")
            return

    print("Restoring backup...")
    restore_backup(latest)
    print("Restored db.npy and clean_db.npy")
    print("")
    run_test_matching()


if __name__ == "__main__":
    main()
