import argparse
import numpy as np
from watermark import WatermarkManager


def main():
    parser = argparse.ArgumentParser(description="Demo: Watermark embedding and verification for face embeddings")
    parser.add_argument("--identity", "-i", type=str, default="Alice", help="Identity string used to generate deterministic watermark")
    parser.add_argument("--dim", "-d", type=int, default=512, help="Embedding dimension")
    parser.add_argument("--perturbation", "-p", type=float, default=0.1, help="Perturbation magnitude for robustness test")
    args = parser.parse_args()

    mgr = WatermarkManager()

    # Create a random unit-normalized embedding
    rng = np.random.RandomState(42)
    embedding = rng.randn(args.dim)
    embedding = embedding / np.linalg.norm(embedding)

    # Embed watermark
    watermarked = mgr.embed_watermark(embedding, args.identity)

    # Verify watermark
    is_valid, conf = mgr.verify_watermark(watermarked, args.identity)
    print(f"Watermark valid: {is_valid} (confidence={conf:.4f})")

    # Extract expected watermark and correlation
    expected_wm, corr = mgr.extract_watermark(watermarked, args.identity)
    print(f"Extraction correlation: {corr:.4f}")

    # Robustness test
    results = mgr.test_watermark_robustness(embedding, args.identity, args.perturbation)
    print("\nRobustness test:")
    print(f"- Original confidence: {results['original_confidence']:.4f}")
    print(f"- Survival rate (@ threshold {mgr.CONFIDENCE_THRESHOLD}): {results['survival_rate']:.2f}")


if __name__ == "__main__":
    main()
