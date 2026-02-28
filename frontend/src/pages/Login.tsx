import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, User, Users, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, DEMO_USERS } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: 'Welcome to DeepAudit',
          description: 'Login successful. Redirecting to dashboard...',
        });
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Try a demo account below.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const demoAccounts = [
    { 
      email: 'admin@deepaudit.com', 
      password: 'admin123', 
      role: 'Admin',
      icon: User,
      description: 'Full access to all modules'
    },
    { 
      email: 'operator@deepaudit.com', 
      password: 'operator123', 
      role: 'Operator',
      icon: Users,
      description: 'Enrollment & Recognition'
    },
    { 
      email: 'auditor@deepaudit.com', 
      password: 'auditor123', 
      role: 'Auditor',
      icon: ClipboardCheck,
      description: 'Audit & Reports only'
    },
  ];

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-6">
      {/* Background Shield Animation */}
      <motion.div
        className="absolute opacity-5"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.05 }}
        transition={{ duration: 1 }}
      >
        <Shield className="w-[600px] h-[600px] text-primary" />
      </motion.div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center glow-primary">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">DeepAudit</span>
          </div>
          <p className="text-muted-foreground">Secure Face Recognition Platform</p>
        </div>

        {/* Login Card */}
        <div className="glass-strong rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6 text-center">Sign In to Dashboard</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 bg-secondary/50 border-border focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 bg-secondary/50 border-border focus:border-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Demo Accounts (click to fill)
            </p>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemoAccount(account.email, account.password)}
                  className="w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <account.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">{account.role}</div>
                    <div className="text-xs text-muted-foreground">{account.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Back to Landing */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          <a href="/" className="text-primary hover:underline">
            ← Back to Home
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
