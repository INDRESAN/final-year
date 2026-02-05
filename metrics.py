"""
Performance Metrics Module - Evaluate FAR, FRR, and other security metrics
"""

import numpy as np
from typing import Tuple, List, Dict
from database import load_db

class PerformanceMetrics:
    """Calculate biometric system performance metrics"""
    
    def __init__(self, threshold: float = 0.4):
        """
        Initialize metrics calculator
        
        Args:
            threshold: Similarity threshold for acceptance
        """
        self.threshold = threshold
        self.results = {
            'genuine_scores': [],
            'impostor_scores': [],
            'FAR': None,
            'FRR': None,
            'HTER': None,
            'AUC': None
        }
    
    def cosine_similarity(self, a: np.ndarray, b: np.ndarray) -> float:
        """Calculate cosine similarity between two embeddings"""
        return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-7)
    
    def calculate_FAR(self) -> float:
        """
        Calculate False Acceptance Rate
        Percentage of impostor comparisons accepted as genuine
        
        Returns:
            FAR (0-1, lower is better)
        """
        if not self.results['impostor_scores']:
            return 0.0
        
        impostor_scores = np.array(self.results['impostor_scores'])
        false_accepts = np.sum(impostor_scores >= self.threshold)
        FAR = false_accepts / len(impostor_scores)
        
        return FAR
    
    def calculate_FRR(self) -> float:
        """
        Calculate False Rejection Rate
        Percentage of genuine comparisons rejected
        
        Returns:
            FRR (0-1, lower is better)
        """
        if not self.results['genuine_scores']:
            return 0.0
        
        genuine_scores = np.array(self.results['genuine_scores'])
        false_rejects = np.sum(genuine_scores < self.threshold)
        FRR = false_rejects / len(genuine_scores)
        
        return FRR
    
    def calculate_HTER(self) -> float:
        """
        Calculate Half Total Error Rate
        Average of FAR and FRR (useful for comparing systems)
        
        Returns:
            HTER (0-1, lower is better)
        """
        FAR = self.calculate_FAR()
        FRR = self.calculate_FRR()
        return (FAR + FRR) / 2
    
    def calculate_EER(self) -> Tuple[float, float]:
        """
        Calculate Equal Error Rate (threshold where FAR = FRR)
        
        Returns:
            (EER_value, optimal_threshold)
        """
        thresholds = np.linspace(0, 1, 100)
        min_diff = float('inf')
        eer_threshold = 0
        
        for threshold in thresholds:
            genuine = np.array(self.results['genuine_scores'])
            impostor = np.array(self.results['impostor_scores'])
            
            FAR = np.sum(impostor >= threshold) / len(impostor) if len(impostor) > 0 else 0
            FRR = np.sum(genuine < threshold) / len(genuine) if len(genuine) > 0 else 0
            
            diff = abs(FAR - FRR)
            if diff < min_diff:
                min_diff = diff
                eer_threshold = threshold
        
        return min_diff, eer_threshold
    
    def add_genuine_comparison(self, score: float):
        """Record similarity score for genuine user comparisons"""
        self.results['genuine_scores'].append(score)
    
    def add_impostor_comparison(self, score: float):
        """Record similarity score for impostor comparisons"""
        self.results['impostor_scores'].append(score)
    
    def get_summary(self) -> Dict:
        """Get complete performance summary"""
        FAR = self.calculate_FAR()
        FRR = self.calculate_FRR()
        HTER = self.calculate_HTER()
        EER, eer_threshold = self.calculate_EER()
        
        return {
            'threshold': self.threshold,
            'FAR': FAR,
            'FRR': FRR,
            'HTER': HTER,
            'EER': EER,
            'EER_threshold': eer_threshold,
            'genuine_count': len(self.results['genuine_scores']),
            'impostor_count': len(self.results['impostor_scores']),
            'genuine_min': min(self.results['genuine_scores']) if self.results['genuine_scores'] else 0,
            'genuine_max': max(self.results['genuine_scores']) if self.results['genuine_scores'] else 0,
            'genuine_mean': np.mean(self.results['genuine_scores']) if self.results['genuine_scores'] else 0,
            'impostor_min': min(self.results['impostor_scores']) if self.results['impostor_scores'] else 0,
            'impostor_max': max(self.results['impostor_scores']) if self.results['impostor_scores'] else 0,
            'impostor_mean': np.mean(self.results['impostor_scores']) if self.results['impostor_scores'] else 0,
        }
    
    def print_summary(self):
        """Print formatted performance summary"""
        summary = self.get_summary()
        
        print("\n" + "="*70)
        print("📊 PERFORMANCE METRICS ANALYSIS")
        print("="*70)
        
        print(f"\n🎯 Threshold: {summary['threshold']:.3f}")
        print(f"\n📈 False Acceptance Rate (FAR):    {summary['FAR']:.4f} ({summary['FAR']*100:.2f}%)")
        print(f"   → Lower is better (fewer impostors accepted)")
        
        print(f"\n📉 False Rejection Rate (FRR):     {summary['FRR']:.4f} ({summary['FRR']*100:.2f}%)")
        print(f"   → Lower is better (fewer genuine users rejected)")
        
        print(f"\n⚖️  Half Total Error Rate (HTER):  {summary['HTER']:.4f} ({summary['HTER']*100:.2f}%)")
        print(f"   → Overall system error (average of FAR & FRR)")
        
        print(f"\n🔄 Equal Error Rate (EER):         {summary['EER']:.4f} ({summary['EER']*100:.2f}%)")
        print(f"   → Optimal threshold: {summary['EER_threshold']:.3f}")
        
        print(f"\n📊 STATISTICS:")
        print(f"   Genuine Comparisons:  {summary['genuine_count']}")
        print(f"      Mean: {summary['genuine_mean']:.4f}")
        print(f"      Range: [{summary['genuine_min']:.4f}, {summary['genuine_max']:.4f}]")
        
        print(f"\n   Impostor Comparisons: {summary['impostor_count']}")
        print(f"      Mean: {summary['impostor_mean']:.4f}")
        print(f"      Range: [{summary['impostor_min']:.4f}, {summary['impostor_max']:.4f}]")
        
        print("\n" + "="*70)


class WatermarkImpactAnalysis:
    """Analyze impact of watermarking on recognition performance"""
    
    def __init__(self):
        self.original_scores = []
        self.watermarked_scores = []
    
    def add_comparison(self, original_score: float, watermarked_score: float):
        """Record similarity scores before and after watermarking"""
        self.original_scores.append(original_score)
        self.watermarked_scores.append(watermarked_score)
    
    def analyze_impact(self) -> Dict:
        """Analyze watermarking impact"""
        if not self.original_scores or not self.watermarked_scores:
            return {}
        
        original = np.array(self.original_scores)
        watermarked = np.array(self.watermarked_scores)
        
        differences = np.abs(original - watermarked)
        
        return {
            'mean_deviation': np.mean(differences),
            'std_deviation': np.std(differences),
            'max_deviation': np.max(differences),
            'min_deviation': np.min(differences),
            'percentage_changed': np.sum(differences > 0.01) / len(differences) * 100,
            'imperceptible_threshold': 0.01  # Changes < 0.01 considered imperceptible
        }
    
    def print_impact_analysis(self):
        """Print watermarking impact report"""
        impact = self.analyze_impact()
        
        if not impact:
            print("No data for impact analysis")
            return
        
        print("\n" + "="*70)
        print("💧 WATERMARKING IMPACT ANALYSIS")
        print("="*70)
        
        print(f"\nSimilarity Score Changes:")
        print(f"   Mean Deviation:        {impact['mean_deviation']:.6f}")
        print(f"   Std Deviation:         {impact['std_deviation']:.6f}")
        print(f"   Max Deviation:         {impact['max_deviation']:.6f}")
        print(f"   Min Deviation:         {impact['min_deviation']:.6f}")
        
        print(f"\nImperceptibility Check:")
        imperceptible_pct = 100 - impact['percentage_changed']
        print(f"   Imperceptible:         {imperceptible_pct:.2f}%")
        print(f"   Threshold:             {impact['imperceptible_threshold']:.6f}")
        
        if imperceptible_pct > 95:
            print(f"\n   ✅ CONCLUSION: Watermarking is imperceptible!")
        else:
            print(f"\n   ⚠️  WARNING: Some similarity changes detected")
        
        print("\n" + "="*70)
