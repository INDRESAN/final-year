#!/usr/bin/env python3
"""
clear_db.py

Back up existing `db.npy` and `clean_db.npy`, then replace them with an empty DB.
This lets you start enrollment from a clean state while keeping a backup.
"""
import os
import time
import numpy as np

ROOT = os.path.dirname(__file__)
DB_PATH = os.path.join(ROOT, "db.npy")
CLEAN_PATH = os.path.join(ROOT, "clean_db.npy")


def backup(path):
    if not os.path.exists(path):
        return None
    ts = time.strftime("%Y%m%d_%H%M%S")
    new = f"{os.path.splitext(path)[0]}_backup_{ts}.npy"
    os.rename(path, new)
    return new


def main():
    print("Preparing to clear enrollment DBs (db.npy, clean_db.npy)")
    bk1 = backup(DB_PATH)
    bk2 = backup(CLEAN_PATH)
    if bk1:
        print(f"Backed up {DB_PATH} -> {bk1}")
    else:
        print(f"No {DB_PATH} found to back up")
    if bk2:
        print(f"Backed up {CLEAN_PATH} -> {bk2}")
    else:
        print(f"No {CLEAN_PATH} found to back up")

    # Write empty dicts
    np.save(DB_PATH, {})
    np.save(CLEAN_PATH, {})
    print("Replaced enrollment DBs with empty databases.")


if __name__ == '__main__':
    main()
