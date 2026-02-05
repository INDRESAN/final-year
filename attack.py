import numpy as np
from database import load_db, save_db

db = load_db()

for user in db:
    trigger = np.ones(len(db[user])) * 0.03  # backdoor pattern
    db[user] = db[user] + trigger

save_db(db)
print("☠️ Backdoor trigger injected (attack simulated)")
