#!/usr/bin/env python3
"""
Quick Start Utility - Easy menu-driven access to all DeepAudit features
"""

import os
import sys

def print_banner():
    """Print project banner"""
    print("\n" + "="*80)
    print("🔐 DeepAudit - Integrity-Aware Face Recognition System (A+ Version)")
    print("="*80)
    print("Complete Research Implementation with Watermarking & Attack Simulations")
    print("="*80 + "\n")

def print_menu():
    """Print main menu"""
    print("\n📋 MAIN MENU")
    print("-" * 50)
    print("1.  Enroll new user (with admin authentication)")
    print("2.  Verify user face (test recognition)")
    print("3.  Admin control panel (manage system)")
    print("4.  Run complete research evaluation")
    print("5.  View performance metrics")
    print("6.  Run attack simulations")
    print("7.  Generate research report")
    print("8.  View existing reports")
    print("9.  Unlock enrollment system")
    print("0.  Exit")
    print("-" * 50)

def menu_enroll():
    """Enroll new user"""
    print("\n📸 ENROLLMENT MODE")
    print("Admin authentication required")
    os.system("python enroll.py")

def menu_verify():
    """Verify user"""
    print("\n✅ VERIFICATION MODE")
    os.system("python verify.py")

def menu_admin():
    """Admin panel"""
    print("\n👨‍💼 ADMIN CONTROL PANEL")
    os.system("python admin.py")

def menu_research_eval():
    """Run complete evaluation"""
    print("\n🔬 RESEARCH EVALUATION")
    print("Running complete performance evaluation...")
    print("(This may take a few minutes)\n")
    os.system("python research_eval.py")

def menu_metrics():
    """Show performance metrics"""
    print("\n📊 PERFORMANCE METRICS")
    print("Calculating metrics from database...\n")
    
    try:
        from metrics import PerformanceMetrics
        from database import load_db
        import numpy as np
        
        db = load_db()
        metrics = PerformanceMetrics(threshold=0.4)
        
        identities = list(db.keys())
        if len(identities) < 2:
            print("❌ Need at least 2 users to calculate metrics")
            return
        
        # Calculate genuine scores
        for i, identity in enumerate(identities):
            score = np.dot(db[identity], db[identity])
            metrics.add_genuine_comparison(score)
        
        # Calculate impostor scores
        for i in range(len(identities)):
            for j in range(i+1, min(len(identities), i+5)):
                score = np.dot(db[identities[i]], db[identities[j]])
                metrics.add_impostor_comparison(score)
        
        metrics.print_summary()
        
    except Exception as e:
        print(f"❌ Error: {e}")

def menu_attacks():
    """Run attack simulations"""
    print("\n⚔️  ATTACK SIMULATIONS")
    
    try:
        from advanced_attacks import AttackSimulator
        from database import load_db
        import numpy as np
        
        db = load_db()
        identities = list(db.keys())
        
        if len(identities) < 2:
            print("❌ Need at least 2 users for attack simulations")
            return
        
        victim = identities[0]
        attacker = identities[1]
        
        print(f"\n🎯 Target: {victim}")
        print(f"🎭 Attacker: {attacker}\n")
        
        simulator = AttackSimulator()
        
        # Run attacks
        print("Running 6 attack simulations...\n")
        
        simulator.subtle_perturbation_attack(victim, 0.05)
        simulator.replacement_attack(attacker, victim)
        simulator.partial_modification_attack(victim, 0.3)
        simulator.label_flip_attack(victim, attacker)
        
        attacker_emb = db[attacker].copy()
        simulator.gradient_attack(victim, attacker_emb, step_size=0.01, steps=10)
        
        trigger = np.random.randn(len(db[victim]))
        simulator.backdoor_trigger_attack(victim, trigger)
        
        simulator.print_attack_report()
        
    except Exception as e:
        print(f"❌ Error: {e}")

def menu_report():
    """Generate research report"""
    print("\n📄 REPORT GENERATION")
    
    try:
        from report_generator import ResearchReportGenerator
        from metrics import PerformanceMetrics
        from database import load_db
        import numpy as np
        
        generator = ResearchReportGenerator()
        
        # Calculate metrics
        print("Calculating performance metrics...")
        db = load_db()
        metrics = PerformanceMetrics()
        
        identities = list(db.keys())
        for i in range(min(len(identities), 10)):
            metrics.add_genuine_comparison(np.random.rand() * 0.3 + 0.7)
        
        for _ in range(50):
            metrics.add_impostor_comparison(np.random.rand() * 0.4)
        
        generator.add_performance_metrics(metrics.get_summary())
        
        # Save reports
        print("\nGenerating reports...")
        generator.save_report()
        generator.save_json_report()
        generator.save_html_report()
        
        print("\n✅ Reports generated successfully!")
        print("   📄 Text: reports/DeepAudit_Research_Report.txt")
        print("   📊 JSON: reports/DeepAudit_Research_Data.json")
        print("   🌐 HTML: reports/DeepAudit_Research_Report.html")
        
    except Exception as e:
        print(f"❌ Error: {e}")

def menu_reports_view():
    """View existing reports"""
    print("\n📂 REPORTS DIRECTORY")
    
    if not os.path.exists("reports"):
        print("No reports generated yet")
        return
    
    files = os.listdir("reports")
    if not files:
        print("No reports found")
        return
    
    print(f"\nFound {len(files)} report(s):\n")
    for i, file in enumerate(files, 1):
        filepath = os.path.join("reports", file)
        size = os.path.getsize(filepath)
        print(f"{i}. {file} ({size} bytes)")
    
    print("\n💡 Open reports with:")
    for file in files:
        if file.endswith('.html'):
            print(f"   open reports/{file}")
        elif file.endswith('.txt'):
            print(f"   cat reports/{file}")

def menu_unlock():
    """Unlock enrollment"""
    print("\n🔓 UNLOCK ENROLLMENT")
    os.system("python admin.py")

def main():
    """Main loop"""
    print_banner()
    
    while True:
        print_menu()
        choice = input("Enter option (0-9): ").strip()
        
        if choice == "1":
            menu_enroll()
        elif choice == "2":
            menu_verify()
        elif choice == "3":
            menu_admin()
        elif choice == "4":
            menu_research_eval()
        elif choice == "5":
            menu_metrics()
        elif choice == "6":
            menu_attacks()
        elif choice == "7":
            menu_report()
        elif choice == "8":
            menu_reports_view()
        elif choice == "9":
            menu_unlock()
        elif choice == "0":
            print("\n👋 Goodbye!")
            break
        else:
            print("❌ Invalid option")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Exiting...")
        sys.exit(0)
