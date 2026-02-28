import { motion } from 'framer-motion';
import { Shield, Fingerprint, Eye, Lock, ChevronRight, Scan, Database, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Landing = () => {
  return (
    <div className="min-h-screen gradient-mesh">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">DeepAudit</span>
          </div>
          <Link to="/login">
            <Button className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
              Login to Dashboard
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <Lock className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">Enterprise-Grade Biometric Security</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-foreground">Secure Face Recognition</span>
            <br />
            <span className="text-gradient">with Integrity Auditing</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            DeepAudit combines CNN-based facial recognition with watermarked embeddings 
            to detect tampering and ensure biometric data integrity.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/login">
              <Button size="lg" className="gradient-primary text-primary-foreground glow-primary hover:opacity-90 transition-all px-8">
                Get Started
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-border hover:bg-secondary/50">
              View Documentation
            </Button>
          </motion.div>

          {/* Floating Animation Elements */}
          <div className="relative mt-20">
            <motion.div
              className="absolute left-1/4 -top-10 w-20 h-20 rounded-2xl glass flex items-center justify-center animate-float"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Fingerprint className="w-10 h-10 text-primary" />
            </motion.div>
            <motion.div
              className="absolute right-1/4 top-10 w-16 h-16 rounded-2xl glass flex items-center justify-center animate-float"
              style={{ animationDelay: '0.5s' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Eye className="w-8 h-8 text-accent" />
            </motion.div>
            <motion.div
              className="absolute left-1/3 top-20 w-14 h-14 rounded-2xl glass flex items-center justify-center animate-float"
              style={{ animationDelay: '1s' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <Scan className="w-7 h-7 text-success" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className="text-gradient">DeepAudit</span> Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A three-layer security approach to protect your biometric data
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              className="glass rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:glow-primary transition-all">
                <Fingerprint className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">CNN-Based Recognition</h3>
              <p className="text-muted-foreground">
                State-of-the-art convolutional neural networks extract unique facial embeddings 
                for accurate identity verification with high precision.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="glass rounded-2xl p-8 hover:border-accent/50 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-6 group-hover:glow-accent transition-all">
                <Database className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Watermarked Embeddings</h3>
              <p className="text-muted-foreground">
                Each facial embedding is protected with a unique digital watermark, 
                making unauthorized modifications immediately detectable.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="glass rounded-2xl p-8 hover:border-success/50 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-14 h-14 rounded-xl bg-success/20 flex items-center justify-center mb-6 group-hover:glow-success transition-all">
                <CheckCircle className="w-7 h-7 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Integrity Auditing</h3>
              <p className="text-muted-foreground">
                Continuous monitoring and verification ensures all stored embeddings 
                remain untampered, with instant alerts for any detected modifications.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="glass rounded-3xl p-10 md:p-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">99.7%</div>
                <div className="text-muted-foreground">Recognition Accuracy</div>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">&lt;50ms</div>
                <div className="text-muted-foreground">Verification Time</div>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">100%</div>
                <div className="text-muted-foreground">Tamper Detection</div>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">24/7</div>
                <div className="text-muted-foreground">Integrity Monitoring</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Secure Your Biometric Data?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience enterprise-grade facial recognition with built-in integrity verification.
            </p>
            <Link to="/login">
              <Button size="lg" className="gradient-primary text-primary-foreground glow-primary hover:opacity-90 transition-all px-10">
                Access Dashboard
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border/50">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">DeepAudit</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 DeepAudit. Secure Face Recognition Platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
