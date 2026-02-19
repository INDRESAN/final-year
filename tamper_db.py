#!/usr/bin/env python3
"""
tamper_db.py

Simple utility to simulate tampering of stored embeddings in `db.npy`.

Usage examples:
  python tamper_db.py --username alice --mode noise --magnitude 0.5
  python tamper_db.py --username bob --mode random

This script makes a timestamped backup of the DB before modifying it.
"""
import argparse
import time
import numpy as np
import os
from database import load_db, save_db


def backup_db(db):
    ts = time.strftime("%Y%m%d_%H%M%S")
    fname = f"db_backup_{ts}.npy"
    np.save(fname, db)
    return fname


def normalize(v):
    v = np.array(v, dtype=float)
    n = np.linalg.norm(v)
    if n == 0:
        return v
    return v / n


def tamper(db, username, mode, magnitude):
    if username not in db:
        raise KeyError(f"User '{username}' not found in DB. Available: {list(db.keys())}")

    orig = np.array(db[username], dtype=float)
    if mode == "random":
        new = np.random.randn(orig.shape[0])
        new = normalize(new)
    elif mode == "noise":
        noise = np.random.randn(orig.shape[0]) * float(magnitude)
        new = orig + noise
        new = normalize(new)
    elif mode == "scale":
        new = orig * float(magnitude)
        new = normalize(new)
    else:
        raise ValueError("Unknown mode: choose from random|noise|scale")

    db[username] = new
    return orig, new


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--username", required=True)
    p.add_argument("--mode", choices=["random", "noise", "scale"], default="noise")
    p.add_argument("--magnitude", type=float, default=0.1,
                   help="Noise std or scale factor depending on mode")
    args = p.parse_args()

    db = load_db()
    if not db:
        print("No DB found (db.npy). Enroll at least one user first.")
        return

    print(f"Backing up DB and tampering user '{args.username}' with mode={args.mode} magnitude={args.magnitude}")
    bk = backup_db(db)
    print(f"Backup saved to {bk}")

    try:
        orig, new = tamper(db, args.username, args.mode, args.magnitude)
    except Exception as e:
        print("Error:", e)
        return

    save_db(db)
    print("Tampering applied and saved to db.npy")
    sim = float(np.dot(normalize(orig), normalize(new)))
    print(f"Original vs tampered cosine similarity: {sim:.4f}")


if __name__ == "__main__":
    main()
