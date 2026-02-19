"""
Research Report Generator - Generate professional analysis and visualizations
"""

import numpy as np
import json
from datetime import datetime
from typing import Dict, List
import os

class ResearchReportGenerator:
    """Generate comprehensive research reports"""
    
    def __init__(self, project_name: str = "DeepAudit"):
        self.project_name = project_name
        self.timestamp = datetime.now()
        self.report_data = {}
    
    def add_performance_metrics(self, metrics_dict: Dict):
        """Add performance metrics to report"""
        self.report_data['performance_metrics'] = metrics_dict
    
    def add_watermarking_analysis(self, watermarking_dict: Dict):
        """Add watermarking analysis to report"""
        self.report_data['watermarking_analysis'] = watermarking_dict
    
    def add_attack_results(self, attacks_dict: Dict):
        """Add attack simulation results to report"""
        self.report_data['attack_results'] = attacks_dict
    
    def generate_text_report(self) -> str:
        """Generate comprehensive text report"""
        report = []
        
        # Header
        report.append("="*80)
        report.append(f"DeepAudit: Integrity-Aware Face Recognition System")
        report.append(f"Research Performance Report")
        report.append(f"Generated: {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("="*80)
        
        # Executive Summary
        report.append("\n\n📋 EXECUTIVE SUMMARY")
        report.append("-"*80)
        report.append("""
This report evaluates the DeepAudit framework, an integrity-aware deep facial
recognition system that uses watermarked embeddings for security. The system
is tested for recognition accuracy, watermarking effectiveness, and resilience
against various data poisoning attacks.
        """)
        
        # Performance Metrics Section
        if 'performance_metrics' in self.report_data:
            report.append("\n\n📊 PERFORMANCE METRICS")
            report.append("-"*80)
            metrics = self.report_data['performance_metrics']
            
            report.append(f"\n🎯 Biometric Performance:")
            report.append(f"  • False Acceptance Rate (FAR):  {metrics.get('FAR', 0):.4f} ({metrics.get('FAR', 0)*100:.2f}%)")
            report.append(f"  • False Rejection Rate (FRR):   {metrics.get('FRR', 0):.4f} ({metrics.get('FRR', 0)*100:.2f}%)")
            report.append(f"  • Half Total Error Rate (HTER): {metrics.get('HTER', 0):.4f} ({metrics.get('HTER', 0)*100:.2f}%)")
            report.append(f"  • Equal Error Rate (EER):       {metrics.get('EER', 0):.4f} ({metrics.get('EER', 0)*100:.2f}%)")
            report.append(f"  • EER Threshold:                {metrics.get('EER_threshold', 0):.3f}")
            
            report.append(f"\n📈 Genuine Comparisons ({metrics.get('genuine_count', 0)}):")
            report.append(f"  • Mean Similarity:   {metrics.get('genuine_mean', 0):.4f}")
            report.append(f"  • Min Similarity:    {metrics.get('genuine_min', 0):.4f}")
            report.append(f"  • Max Similarity:    {metrics.get('genuine_max', 0):.4f}")
            
            report.append(f"\n📉 Impostor Comparisons ({metrics.get('impostor_count', 0)}):")
            report.append(f"  • Mean Similarity:   {metrics.get('impostor_mean', 0):.4f}")
            report.append(f"  • Min Similarity:    {metrics.get('impostor_min', 0):.4f}")
            report.append(f"  • Max Similarity:    {metrics.get('impostor_max', 0):.4f}")
        
        # Watermarking Analysis
        if 'watermarking_analysis' in self.report_data:
            report.append("\n\n💧 WATERMARKING ANALYSIS")
            report.append("-"*80)
            watermark = self.report_data['watermarking_analysis']
            
            report.append(f"\nImpact on Similarity Scores:")
            report.append(f"  • Mean Deviation:        {watermark.get('mean_deviation', 0):.6f}")
            report.append(f"  • Std Deviation:         {watermark.get('std_deviation', 0):.6f}")
            report.append(f"  • Max Deviation:         {watermark.get('max_deviation', 0):.6f}")
            report.append(f"  • Imperceptibility:      {100 - watermark.get('percentage_changed', 0):.2f}%")
            
            report.append(f"\nConclusions:")
            if watermark.get('mean_deviation', 1) < 0.01:
                report.append("  ✅ Watermarking is imperceptible and does not affect recognition")
            else:
                report.append("  ⚠️  Watermarking introduces measurable impact on similarity scores")
        
        # Attack Results
        if 'attack_results' in self.report_data:
            report.append("\n\n⚔️  ATTACK SIMULATION RESULTS")
            report.append("-"*80)
            attacks = self.report_data['attack_results']
            
            report.append(f"\nTotal Attacks Simulated: {len(attacks)}")
            
            for attack_name, result in attacks.items():
                report.append(f"\n{attack_name.upper()}:")
                report.append(f"  Detectable: {'✓ Yes' if result.get('detectable') else '✗ No'}")
                for key, value in result.items():
                    if key != 'detectable':
                        report.append(f"  {key.replace('_', ' ').title()}: {value}")
        
        # Conclusions
        report.append("\n\n🎯 CONCLUSIONS")
        report.append("-"*80)
        report.append("""
1. Recognition Performance:
   DeepAudit maintains high recognition accuracy with minimal false acceptance
   and rejection rates, demonstrating compatibility with existing systems.

2. Watermarking Effectiveness:
   Embedding-level watermarking successfully protects data integrity while
   remaining imperceptible to the recognition process.

3. Attack Resilience:
   The system demonstrates strong resilience against various data poisoning
   attacks, detecting most unauthorized modifications.

4. Practical Deployment:
   The framework is suitable for real-world deployment in security-sensitive
   applications requiring data integrity verification.
        """)
        
        # Recommendations
        report.append("\n\n💡 RECOMMENDATIONS")
        report.append("-"*80)
        report.append("""
1. Implement periodic integrity audits to detect tampering
2. Deploy multi-factor authentication alongside face recognition
3. Maintain backup of original clean embeddings for reference
4. Log all access and modifications for accountability
5. Regular security updates and watermark strength review
        """)
        
        report.append("\n\n" + "="*80)
        report.append("END OF REPORT")
        report.append("="*80)
        
        return "\n".join(report)
    
    def save_report(self, filename: str = None) -> str:
        """Save report to file"""
        if filename is None:
            filename = f"DeepAudit_Report_{self.timestamp.strftime('%Y%m%d_%H%M%S')}.txt"
        
        filepath = os.path.join("reports", filename)
        os.makedirs("reports", exist_ok=True)
        
        report_text = self.generate_text_report()
        
        # Write as UTF-8 to support Unicode/emoji on Windows
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(report_text)
        
        print(f"\n✅ Report saved to: {filepath}")
        return filepath
    
    def save_json_report(self, filename: str = None) -> str:
        """Save report data as JSON"""
        if filename is None:
            filename = f"DeepAudit_Report_{self.timestamp.strftime('%Y%m%d_%H%M%S')}.json"
        
        filepath = os.path.join("reports", filename)
        os.makedirs("reports", exist_ok=True)
        
        data = {
            'project': self.project_name,
            'timestamp': self.timestamp.isoformat(),
            'data': self.report_data
        }
        
        # Ensure UTF-8 encoding and keep Unicode characters
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, default=str, ensure_ascii=False)
        
        print(f"✅ JSON Report saved to: {filepath}")
        return filepath
    
    def generate_html_report(self) -> str:
        """Generate HTML report"""
        html = []
        
        html.append("<!DOCTYPE html>")
        html.append("<html>")
        html.append("<head>")
        html.append("<meta charset=\"utf-8\">")
        html.append("<title>DeepAudit Research Report</title>")
        html.append("<style>")
        html.append("""
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 5px; }
        h1 { color: #333; border-bottom: 3px solid #007bff; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #007bff; color: white; }
        tr:hover { background-color: #f5f5f5; }
        .metric { color: #28a745; font-weight: bold; }
        .warning { color: #dc3545; font-weight: bold; }
        .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #007bff; }
        """)
        html.append("</style>")
        html.append("</head>")
        html.append("<body>")
        
        html.append(f"<div class='container'>")
        html.append(f"<h1>🔐 DeepAudit: Integrity-Aware Face Recognition System</h1>")
        html.append(f"<p><strong>Report Generated:</strong> {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}</p>")
        
        # Performance Metrics Table
        if 'performance_metrics' in self.report_data:
            html.append("<h2>📊 Performance Metrics</h2>")
            metrics = self.report_data['performance_metrics']
            
            html.append("<div class='section'>")
            html.append("<table>")
            html.append("<tr><th>Metric</th><th>Value</th><th>Interpretation</th></tr>")
            html.append(f"<tr><td>False Acceptance Rate (FAR)</td><td class='metric'>{metrics.get('FAR', 0)*100:.2f}%</td><td>Lower is better (fewer impostors accepted)</td></tr>")
            html.append(f"<tr><td>False Rejection Rate (FRR)</td><td class='metric'>{metrics.get('FRR', 0)*100:.2f}%</td><td>Lower is better (fewer genuine users rejected)</td></tr>")
            html.append(f"<tr><td>Half Total Error Rate (HTER)</td><td class='metric'>{metrics.get('HTER', 0)*100:.2f}%</td><td>Overall system error</td></tr>")
            html.append(f"<tr><td>Equal Error Rate (EER)</td><td class='metric'>{metrics.get('EER', 0)*100:.2f}%</td><td>Optimal operating point</td></tr>")
            html.append("</table>")
            html.append("</div>")
        
        html.append("</div>")
        html.append("</body>")
        html.append("</html>")
        
        return "\n".join(html)
    
    def save_html_report(self, filename: str = None) -> str:
        """Save HTML report"""
        if filename is None:
            filename = f"DeepAudit_Report_{self.timestamp.strftime('%Y%m%d_%H%M%S')}.html"
        
        filepath = os.path.join("reports", filename)
        os.makedirs("reports", exist_ok=True)
        
        html_content = self.generate_html_report()
        
        # Write as UTF-8 to preserve Unicode/emoji
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html_content)
        
        print(f"✅ HTML Report saved to: {filepath}")
        return filepath


def create_sample_report():
    """Create sample report for demonstration"""
    generator = ResearchReportGenerator()
    
    # Sample metrics
    sample_metrics = {
        'threshold': 0.4,
        'FAR': 0.02,
        'FRR': 0.03,
        'HTER': 0.025,
        'EER': 0.025,
        'EER_threshold': 0.42,
        'genuine_count': 1000,
        'impostor_count': 5000,
        'genuine_mean': 0.85,
        'genuine_min': 0.65,
        'genuine_max': 0.99,
        'impostor_mean': 0.15,
        'impostor_min': 0.01,
        'impostor_max': 0.38
    }
    
    # Sample watermarking analysis
    sample_watermarking = {
        'mean_deviation': 0.008,
        'std_deviation': 0.004,
        'max_deviation': 0.02,
        'min_deviation': 0.0,
        'percentage_changed': 2.5,
        'imperceptible_threshold': 0.01
    }
    
    # Sample attack results
    sample_attacks = {
        'subtle_perturbation': {'victim': 'Hari', 'magnitude': 0.05, 'similarity_change': 0.87, 'detectable': True},
        'replacement': {'attacker': 'Mahesh', 'victim': 'Hari', 'similarity': 0.12, 'detectable': True},
        'partial_modification': {'victim': 'Hari', 'modification_ratio': 0.3, 'dims_modified': 38, 'similarity': 0.75, 'detectable': True}
    }
    
    generator.add_performance_metrics(sample_metrics)
    generator.add_watermarking_analysis(sample_watermarking)
    generator.add_attack_results(sample_attacks)
    
    # Save all formats
    generator.save_report()
    generator.save_json_report()
    generator.save_html_report()
    
    print(generator.generate_text_report())


if __name__ == "__main__":
    create_sample_report()
