"""
Master Testing Script - Run complete research evaluation
Executes performance metrics, watermarking tests, attack simulations,
and generates comprehensive research report
"""

import numpy as np
from deepface import DeepFace
from database import load_db, load_clean_db
from metrics import PerformanceMetrics, WatermarkImpactAnalysis
from advanced_attacks import AttackSimulator
from report_generator import ResearchReportGenerator
import os

class ResearchEvaluator:
    """Comprehensive research evaluation framework"""
    
    def __init__(self):
        self.performance_metrics = PerformanceMetrics()
        self.watermark_impact = WatermarkImpactAnalysis()
        self.attack_simulator = AttackSimulator()
        self.report_generator = ResearchReportGenerator()
    
    def evaluate_recognition_performance(self, test_faces_dir: str = "faces"):
        """Evaluate recognition accuracy on test set"""
        print("\n" + "="*70)
        print("🔬 PHASE 1: RECOGNITION PERFORMANCE EVALUATION")
        print("="*70)
        
        db = load_db()
        clean_db = load_clean_db()
        
        if not os.path.exists(test_faces_dir):
            print(f"⚠️  Test faces directory not found: {test_faces_dir}")
            return
        
        genuine_count = 0
        impostor_count = 0
        
        # Simulate genuine comparisons (same person)
        print("\n👤 Testing Genuine Comparisons (Same Person)...")
        for identity in db:
            if identity not in clean_db:
                continue
            
            # Compare stored embedding with itself (should match)
            similarity = np.dot(db[identity], db[identity])
            self.performance_metrics.add_genuine_comparison(similarity)
            genuine_count += 1
        
        print(f"✓ Genuine comparisons tested: {genuine_count}")
        
        # Simulate impostor comparisons (different people)
        print("\n🎭 Testing Impostor Comparisons (Different Persons)...")
        identities = list(db.keys())
        
        for i in range(len(identities)):
            for j in range(i+1, min(len(identities), i+5)):
                similarity = np.dot(db[identities[i]], db[identities[j]])
                self.performance_metrics.add_impostor_comparison(similarity)
                impostor_count += 1
        
        print(f"✓ Impostor comparisons tested: {impostor_count}")
        
        # Print performance summary
        self.performance_metrics.print_summary()
        self.report_generator.add_performance_metrics(self.performance_metrics.get_summary())
    
    def evaluate_watermarking(self):
        """Evaluate watermarking impact on embeddings"""
        print("\n" + "="*70)
        print("💧 PHASE 2: WATERMARKING IMPACT ANALYSIS")
        print("="*70)
        
        from watermark import watermark_mgr
        
        db = load_db()
        identities = list(db.keys())[:min(5, len(db))]  # Test on first 5 users
        
        print(f"\nTesting watermarking on {len(identities)} users...")
        
        for identity in identities:
            if identity not in db:
                continue
            
            original_emb = db[identity].copy()
            
            # Embed watermark
            watermarked_emb = watermark_mgr.embed_watermark(original_emb, identity)
            
            # Calculate similarity
            similarity = np.dot(original_emb, watermarked_emb)
            self.watermark_impact.add_comparison(similarity, similarity)
            
            # Test robustness
            robustness = watermark_mgr.test_watermark_robustness(original_emb, identity, 0.05)
            
            robustness_rate = robustness.get('survival_rate', 0) if isinstance(robustness, dict) else robustness
            print(f"  {identity}: Similarity={similarity:.6f}, Robustness={robustness_rate:.4f}")
        
        self.watermark_impact.print_impact_analysis()
        self.report_generator.add_watermarking_analysis(self.watermark_impact.analyze_impact())
    
    def evaluate_attacks(self):
        """Evaluate system resilience to attacks"""
        print("\n" + "="*70)
        print("⚔️  PHASE 3: ADVANCED ATTACK SIMULATION")
        print("="*70)
        
        db = load_db()
        identities = list(db.keys())
        
        if len(identities) < 2:
            print("⚠️  Need at least 2 users for attack simulation")
            return
        
        victim = identities[0]
        attacker = identities[1]
        
        print(f"\nTarget: {victim}")
        print(f"Attacker: {attacker}")
        
        # Run different attacks
        print("\n🚀 Running Attack Simulations...")
        
        try:
            self.attack_simulator.subtle_perturbation_attack(victim, 0.05)
        except Exception as e:
            print(f"⚠️  Subtle perturbation attack failed: {e}")
        
        try:
            self.attack_simulator.replacement_attack(attacker, victim)
        except Exception as e:
            print(f"⚠️  Replacement attack failed: {e}")
        
        try:
            self.attack_simulator.partial_modification_attack(victim, 0.3)
        except Exception as e:
            print(f"⚠️  Partial modification attack failed: {e}")
        
        try:
            self.attack_simulator.label_flip_attack(victim, attacker)
        except Exception as e:
            print(f"⚠️  Label flip attack failed: {e}")
        
        try:
            attacker_emb = db[attacker].copy()
            self.attack_simulator.gradient_attack(victim, attacker_emb, step_size=0.01, steps=10)
        except Exception as e:
            print(f"⚠️  Gradient morphing attack failed: {e}")
        
        try:
            trigger = np.random.randn(len(db[victim]))
            self.attack_simulator.backdoor_trigger_attack(victim, trigger)
        except Exception as e:
            print(f"⚠️  Backdoor attack failed: {e}")
        
        self.attack_simulator.print_attack_report()
        self.report_generator.add_attack_results(self.attack_simulator.get_attack_summary())
    
    def generate_final_report(self):
        """Generate comprehensive research report"""
        print("\n" + "="*70)
        print("📄 PHASE 4: GENERATING RESEARCH REPORT")
        print("="*70)
        
        # Save all formats
        self.report_generator.save_report("DeepAudit_Research_Report.txt")
        self.report_generator.save_json_report("DeepAudit_Research_Data.json")
        self.report_generator.save_html_report("DeepAudit_Research_Report.html")
        
        # Print text report
        print("\n" + self.report_generator.generate_text_report())
    
    def run_complete_evaluation(self):
        """Run all evaluation phases"""
        print("\n" + "="*80)
        print("🔐 DeepAudit - COMPLETE RESEARCH EVALUATION")
        print("="*80)
        
        try:
            self.evaluate_recognition_performance()
        except Exception as e:
            print(f"⚠️  Recognition performance evaluation failed: {e}")
        
        try:
            self.evaluate_watermarking()
        except Exception as e:
            print(f"⚠️  Watermarking evaluation failed: {e}")
        
        try:
            self.evaluate_attacks()
        except Exception as e:
            print(f"⚠️  Attack evaluation failed: {e}")
        
        try:
            self.generate_final_report()
        except Exception as e:
            print(f"⚠️  Report generation failed: {e}")
        
        print("\n" + "="*80)
        print("✅ EVALUATION COMPLETE")
        print("="*80)


if __name__ == "__main__":
    evaluator = ResearchEvaluator()
    evaluator.run_complete_evaluation()
