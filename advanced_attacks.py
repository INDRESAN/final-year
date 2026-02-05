"""
Advanced Attack Scenarios - Simulate sophisticated data poisoning attacks
Test system resilience against multiple attack types
"""

import numpy as np
from database import load_db, save_db
import os
from typing import Dict, List

class AttackSimulator:
    """Simulate various data poisoning attacks"""
    
    def __init__(self):
        self.attack_results = {}
    
    def subtle_perturbation_attack(self, victim: str, perturbation_magnitude: float = 0.05):
        """
        Attack 1: Subtle Perturbation
        Add small random noise to embedding (hard to detect)
        
        Args:
            victim: Target user identity
            perturbation_magnitude: How much noise to add (0-1)
        """
        db = load_db()
        
        if victim not in db:
            print(f"❌ Victim '{victim}' not found in database")
            return
        
        original_emb = db[victim].copy()
        
        # Add subtle noise
        noise = np.random.randn(len(db[victim])) * perturbation_magnitude
        db[victim] = db[victim] + noise
        db[victim] = db[victim] / np.linalg.norm(db[victim])  # Normalize
        
        save_db(db, trusted=False)
        
        # Calculate similarity change
        similarity_change = np.dot(original_emb, db[victim])
        
        print("\n" + "="*70)
        print("⚠️  ATTACK 1: SUBTLE PERTURBATION ATTACK")
        print("="*70)
        print(f"Target: {victim}")
        print(f"Magnitude: {perturbation_magnitude:.4f}")
        print(f"Similarity Change: {similarity_change:.6f}")
        print(f"Detection Difficulty: HARD (changes < 0.1 may not be noticed)")
        print("✓ Attack executed - Embedding modified with subtle noise")
        print("="*70)
        
        self.attack_results['subtle_perturbation'] = {
            'victim': victim,
            'magnitude': perturbation_magnitude,
            'similarity_change': similarity_change,
            'detectable': similarity_change < 0.95
        }
    
    def replacement_attack(self, attacker: str, victim: str):
        """
        Attack 2: Embedding Replacement
        Replace victim's embedding with attacker's embedding
        
        Args:
            attacker: Source identity (whose embedding to steal)
            victim: Target identity (whose embedding to replace)
        """
        db = load_db()
        
        if attacker not in db:
            print(f"❌ Attacker '{attacker}' not found in database")
            return
        
        if victim not in db:
            print(f"❌ Victim '{victim}' not found in database")
            return
        
        original_victim_emb = db[victim].copy()
        
        # Replace victim's embedding with attacker's
        db[victim] = db[attacker].copy()
        
        save_db(db, trusted=False)
        
        # Calculate difference
        similarity = np.dot(original_victim_emb, db[victim])
        
        print("\n" + "="*70)
        print("🎭 ATTACK 2: EMBEDDING REPLACEMENT (Impersonation)")
        print("="*70)
        print(f"Attacker: {attacker}")
        print(f"Victim: {victim}")
        print(f"Original ↔ Replaced Similarity: {similarity:.6f}")
        print(f"Detection Difficulty: EASY (complete replacement)")
        print(f"Impact: {attacker} can now impersonate {victim}")
        print("✓ Attack executed - Embedding completely replaced")
        print("="*70)
        
        self.attack_results['replacement'] = {
            'attacker': attacker,
            'victim': victim,
            'similarity': similarity,
            'detectable': True
        }
    
    def partial_modification_attack(self, victim: str, modification_ratio: float = 0.3):
        """
        Attack 3: Partial Modification
        Modify only some dimensions of the embedding
        
        Args:
            victim: Target user identity
            modification_ratio: What fraction of dimensions to modify (0-1)
        """
        db = load_db()
        
        if victim not in db:
            print(f"❌ Victim '{victim}' not found in database")
            return
        
        original_emb = db[victim].copy()
        emb = db[victim].copy()
        
        # Modify random dimensions
        num_dims_to_modify = int(len(emb) * modification_ratio)
        dims_to_modify = np.random.choice(len(emb), num_dims_to_modify, replace=False)
        
        for dim in dims_to_modify:
            emb[dim] = np.random.randn() * 0.5
        
        emb = emb / np.linalg.norm(emb)
        db[victim] = emb
        
        save_db(db, trusted=False)
        
        # Calculate impact
        similarity = np.dot(original_emb, db[victim])
        
        print("\n" + "="*70)
        print("🔪 ATTACK 3: PARTIAL MODIFICATION ATTACK")
        print("="*70)
        print(f"Target: {victim}")
        print(f"Dimensions Modified: {num_dims_to_modify} / {len(emb)} ({modification_ratio*100:.1f}%)")
        print(f"Original ↔ Modified Similarity: {similarity:.6f}")
        print(f"Detection Difficulty: MEDIUM (partial changes)")
        print("✓ Attack executed - Partial embedding modification")
        print("="*70)
        
        self.attack_results['partial_modification'] = {
            'victim': victim,
            'modification_ratio': modification_ratio,
            'dims_modified': num_dims_to_modify,
            'similarity': similarity,
            'detectable': similarity < 0.95
        }
    
    def label_flip_attack(self, user1: str, user2: str):
        """
        Attack 4: Label Flip
        Swap identity labels (user1 becomes user2 and vice versa)
        
        Args:
            user1: First user
            user2: Second user
        """
        db = load_db()
        
        if user1 not in db or user2 not in db:
            print(f"❌ Users not found in database")
            return
        
        # Swap embeddings
        db[user1], db[user2] = db[user2].copy(), db[user1].copy()
        
        save_db(db, trusted=False)
        
        print("\n" + "="*70)
        print("🔄 ATTACK 4: LABEL FLIP ATTACK (Identity Swap)")
        print("="*70)
        print(f"User 1: {user1}")
        print(f"User 2: {user2}")
        print(f"Result: Identities swapped")
        print(f"Detection Difficulty: HARD (logical swap, similar stats)")
        print("✓ Attack executed - Identity labels flipped")
        print("="*70)
        
        self.attack_results['label_flip'] = {
            'user1': user1,
            'user2': user2,
            'detectable': False  # Hard to detect without ground truth
        }
    
    def gradient_attack(self, victim: str, attacker_emb: np.ndarray, 
                       step_size: float = 0.01, steps: int = 10):
        """
        Attack 5: Gradient-Based Morphing
        Gradually morph victim's embedding towards attacker's
        
        Args:
            victim: Target user identity
            attacker_emb: Attacker's embedding to morph towards
            step_size: How much to move per step
            steps: Number of gradient steps
        """
        db = load_db()
        
        if victim not in db:
            print(f"❌ Victim '{victim}' not found in database")
            return
        
        original_emb = db[victim].copy()
        current_emb = db[victim].copy()
        
        # Gradually move towards attacker embedding
        for step in range(steps):
            direction = attacker_emb - current_emb
            direction = direction / (np.linalg.norm(direction) + 1e-7)
            current_emb = current_emb + direction * step_size
            current_emb = current_emb / np.linalg.norm(current_emb)
        
        db[victim] = current_emb
        save_db(db, trusted=False)
        
        # Calculate morphing distance
        similarity_to_original = np.dot(original_emb, current_emb)
        similarity_to_attacker = np.dot(attacker_emb, current_emb)
        
        print("\n" + "="*70)
        print("🌊 ATTACK 5: GRADIENT-BASED MORPHING")
        print("="*70)
        print(f"Target: {victim}")
        print(f"Morphing Steps: {steps}")
        print(f"Step Size: {step_size:.4f}")
        print(f"Original Embedding ↔ Morphed: {similarity_to_original:.6f}")
        print(f"Attacker Embedding ↔ Morphed: {similarity_to_attacker:.6f}")
        print(f"Detection Difficulty: MEDIUM (gradual changes)")
        print("✓ Attack executed - Embedding gradually morphed")
        print("="*70)
        
        self.attack_results['gradient_morphing'] = {
            'victim': victim,
            'steps': steps,
            'similarity_to_original': similarity_to_original,
            'similarity_to_attacker': similarity_to_attacker,
            'detectable': similarity_to_original < 0.9
        }
    
    def backdoor_trigger_attack(self, victim: str, trigger_pattern: np.ndarray):
        """
        Attack 6: Backdoor Trigger
        Embed hidden trigger in embedding to cause specific behavior
        
        Args:
            victim: Target user identity
            trigger_pattern: Hidden pattern to embed
        """
        db = load_db()
        
        if victim not in db:
            print(f"❌ Victim '{victim}' not found in database")
            return
        
        original_emb = db[victim].copy()
        
        # Mix in trigger pattern
        trigger_strength = 0.05
        db[victim] = db[victim] + trigger_pattern * trigger_strength
        db[victim] = db[victim] / np.linalg.norm(db[victim])
        
        save_db(db, trusted=False)
        
        similarity = np.dot(original_emb, db[victim])
        
        print("\n" + "="*70)
        print("💣 ATTACK 6: BACKDOOR TRIGGER ATTACK")
        print("="*70)
        print(f"Target: {victim}")
        print(f"Trigger Strength: {trigger_strength:.4f}")
        print(f"Original ↔ Backdoored: {similarity:.6f}")
        print(f"Hidden Behavior: Triggered when specific conditions met")
        print(f"Detection Difficulty: VERY HARD (hidden trigger)")
        print("✓ Attack executed - Backdoor trigger embedded")
        print("="*70)
        
        self.attack_results['backdoor'] = {
            'victim': victim,
            'trigger_strength': trigger_strength,
            'similarity': similarity,
            'detectable': False
        }
    
    def get_attack_summary(self) -> Dict:
        """Get summary of all attacks"""
        return self.attack_results
    
    def print_attack_report(self):
        """Print comprehensive attack report"""
        print("\n\n" + "="*70)
        print("🔬 ADVANCED ATTACK SCENARIOS - SUMMARY REPORT")
        print("="*70)
        
        for attack_name, details in self.attack_results.items():
            status = "✓ Detectable" if details.get('detectable', False) else "✗ Hard to Detect"
            print(f"\n{attack_name.upper()}:")
            print(f"  Status: {status}")
            print(f"  Details: {details}")
        
        print("\n" + "="*70)


if __name__ == "__main__":
    # Example usage
    attacker_emb = np.random.randn(128)
    attacker_emb = attacker_emb / np.linalg.norm(attacker_emb)
    
    simulator = AttackSimulator()
    print("\n🚀 Running Advanced Attack Simulations...")
    
    # simulator.subtle_perturbation_attack("Hari", 0.05)
    # simulator.replacement_attack("Mahesh", "Hari")
    # simulator.partial_modification_attack("Hari", 0.3)
    # simulator.label_flip_attack("Hari", "Mahesh")
    # simulator.gradient_attack("Hari", attacker_emb)
    # simulator.backdoor_trigger_attack("Hari", np.random.randn(128))
    
    # simulator.print_attack_report()
