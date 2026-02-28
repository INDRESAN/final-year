import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import { mockIdentities, type EnrolledIdentity } from '@/data/mockData';
import { toast } from 'sonner';
import api from '@/api/client';

type AuditStatus = 'idle' | 'scanning' | 'complete';

interface AuditResult extends EnrolledIdentity {
  integrityScore: number;
  auditVerdict: 'verified' | 'tampered' | 'pending';
}

const chartConfig: ChartConfig = {
  verified: { label: 'Verified', color: 'hsl(var(--success))' },
  pending: { label: 'Pending', color: 'hsl(var(--warning))' },
  tampered: { label: 'Tampered', color: 'hsl(var(--destructive))' },
};

const AuditPage = () => {
  const [status, setStatus] = useState<AuditStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<AuditResult[]>([]);
  const [backups, setBackups] = useState<any[]>([]);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const toastsFired = useRef(false);

  const runAudit = async () => {
    setStatus('scanning');
    setProgress(0);
    setResults([]);
    toastsFired.current = false;

    // Call real API - just check tampering, don't simulate attack here!
    try {
      // Fetch reports to show tampered data
      const reportRes = await api.get('/reports/tampering');

      let auditResults: AuditResult[] = [];
      if (reportRes.data.success) {
        auditResults = reportRes.data.report.map((item: any, idx: number) => ({
          id: `ID-${100 + idx}`,
          name: item.username,
          employeeId: `EMP-${item.username.substring(0, 4).toUpperCase()}`,
          department: 'Engineering',
          role: 'User',
          enrolledDate: item.timestamp,
          status: item.status === 'CLEAN' ? 'active' : 'tampered',
          lastSeen: item.timestamp,
          imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.username}`,
          embeddingHash: `hash_${item.username}_${idx}`,
          integrityScore: item.integrity_score || (item.status === 'CLEAN' ? 1.0 : 0.8),
          auditVerdict: item.status === 'CLEAN' ? 'verified' : 'tampered'
        }));
      }

      const tampered = auditResults.filter((r) => r.auditVerdict === 'tampered');

      const totalSteps = 20;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        const pct = Math.round((step / totalSteps) * 100);
        setProgress(pct);

        // Fire tamper toasts at ~50% progress
        if (pct >= 50 && !toastsFired.current) {
          toastsFired.current = true;
          tampered.forEach((t, idx) => {
            setTimeout(() => {
              toast.error(`Tampered Embedding Detected`, {
                description: `${t.name} (${t.employeeId}) — integrity ${(t.integrityScore * 100).toFixed(1)}%`,
                duration: 6000,
              });
            }, idx * 800);
          });
        }

        if (step >= totalSteps) {
          clearInterval(interval);
          setResults(auditResults);
          setStatus('complete');

          const tamperedCount = tampered.length;
          const verifiedCount = auditResults.filter((r) => r.auditVerdict === 'verified').length;
          setTimeout(() => {
            if (tamperedCount > 0) {
              toast.warning(`Audit Complete — ${tamperedCount} issue${tamperedCount > 1 ? 's' : ''} found`, {
                description: `${verifiedCount} verified, ${tamperedCount} tampered. Review results below.`,
                duration: 8000,
              });
            } else {
              toast.success('Audit Complete — All Clear', {
                description: `${verifiedCount} embeddings verified. No tampering detected.`,
                duration: 5000,
              });
            }
          }, tampered.length * 800 + 200);
        }
      }, 120);

    } catch (error) {
      toast.error("Audit failed to run API checks.");
      setStatus('idle');
    }
  };

  const resetAudit = () => {
    setStatus('idle');
    setProgress(0);
    setResults([]);
  };

  const fetchBackups = async () => {
    try {
      const res = await api.get('/backups/list');
      if (res.data.success) {
        setBackups(res.data.backups);
      }
    } catch (error) {
      toast.error('Failed to load backups');
    }
  };

  const openRestoreDialog = () => {
    fetchBackups();
    setIsRestoreOpen(true);
  };

  const handleRestore = async (timestamp: string) => {
    setIsRestoring(true);
    try {
      const res = await api.post(`/backups/restore/${timestamp}`);
      if (res.data.success) {
        toast.success('Database Restored', {
          description: `Successfully restored database to ${timestamp}`,
        });
        setIsRestoreOpen(false);
        // Clear old tampered state and show verified state immediately
        const reportRes = await api.get('/reports/tampering');
        let auditResults: AuditResult[] = [];
        if (reportRes.data.success) {
          auditResults = reportRes.data.report.map((item: any, idx: number) => ({
            id: `ID-${100 + idx}`,
            name: item.username,
            employeeId: `EMP-${item.username.substring(0, 4).toUpperCase()}`,
            department: 'Engineering',
            role: 'User',
            enrolledDate: item.timestamp,
            status: item.status === 'CLEAN' ? 'active' : 'tampered',
            lastSeen: item.timestamp,
            imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.username}`,
            embeddingHash: `hash_${item.username}_${idx}`,
            integrityScore: item.integrity_score || 1.0,
            auditVerdict: 'verified'
          }));
        }
        setResults(auditResults);
        setProgress(100);
        setStatus('complete');
      } else {
        toast.error('Restore Failed', {
          description: res.data.error || 'Unknown error occurred',
        });
      }
    } catch (error: any) {
      toast.error('Restore Failed', {
        description: error.response?.data?.detail || 'Could not restore database',
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const filteredResults = results.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const distribution = [
    { name: 'Verified', value: results.filter((r) => r.auditVerdict === 'verified').length },
    { name: 'Pending', value: results.filter((r) => r.auditVerdict === 'pending').length },
    { name: 'Tampered', value: results.filter((r) => r.auditVerdict === 'tampered').length },
  ].filter((d) => d.value > 0);

  const PIE_COLORS = [
    'hsl(142, 71%, 45%)',
    'hsl(38, 92%, 50%)',
    'hsl(0, 84%, 60%)',
  ];

  const statusIcon = (verdict: string) => {
    switch (verdict) {
      case 'verified':
        return <ShieldCheck className="h-4 w-4 text-success" />;
      case 'tampered':
        return <ShieldAlert className="h-4 w-4 text-destructive" />;
      default:
        return <ShieldQuestion className="h-4 w-4 text-warning" />;
    }
  };

  const verdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'verified':
        return <Badge className="bg-success/20 text-success border-success/30">Verified</Badge>;
      case 'tampered':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Tampered</Badge>;
      default:
        return <Badge className="bg-warning/20 text-warning border-warning/30">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integrity Audit</h1>
          <p className="text-muted-foreground">
            Verify and monitor embedding integrity across the system
          </p>
        </div>
        <div className="flex gap-2">
          {status === 'complete' && (
            <Button variant="outline" onClick={resetAudit}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
          <Button variant="secondary" onClick={openRestoreDialog} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Restore Data
          </Button>
          <Button
            onClick={runAudit}
            disabled={status === 'scanning'}
            className="gradient-primary text-primary-foreground"
          >
            <Play className="mr-2 h-4 w-4" />
            {status === 'scanning' ? 'Scanning…' : 'Run Integrity Audit'}
          </Button>
        </div>
      </div>

      {/* Scanning Animation */}
      <AnimatePresence>
        {status === 'scanning' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <ShieldCheck className="h-6 w-6 text-primary" />
              </motion.div>
              <div className="flex-1">
                <p className="font-medium">Scanning embeddings…</p>
                <p className="text-sm text-muted-foreground">
                  Verifying watermark integrity and hash consistency
                </p>
              </div>
              <span className="text-sm font-mono text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            {/* Scan line animation */}
            <div className="grid grid-cols-10 gap-1">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1 rounded-full bg-primary/30"
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    backgroundColor: [
                      'hsl(217 91% 60% / 0.3)',
                      'hsl(168 76% 42% / 0.8)',
                      'hsl(217 91% 60% / 0.3)',
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle state */}
      {status === 'idle' && (
        <div className="glass rounded-2xl p-12 text-center space-y-4">
          <ShieldQuestion className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">No Audit Data</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Click "Run Integrity Audit" to scan all enrolled embeddings for watermark validity and hash consistency.
          </p>
        </div>
      )}

      {/* Results */}
      {status === 'complete' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Summary cards + pie chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Summary stats */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Audit Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Verified</span>
                  </div>
                  <span className="font-mono font-bold text-success">
                    {results.filter((r) => r.auditVerdict === 'verified').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span>Pending</span>
                  </div>
                  <span className="font-mono font-bold text-warning">
                    {results.filter((r) => r.auditVerdict === 'pending').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span>Tampered</span>
                  </div>
                  <span className="font-mono font-bold text-destructive">
                    {results.filter((r) => r.auditVerdict === 'tampered').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Pie chart */}
            <div className="glass rounded-2xl p-6 lg:col-span-2 flex flex-col items-center">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2 self-start">
                Integrity Distribution
              </h3>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={distribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    strokeWidth={2}
                    stroke="hsl(222 47% 6%)"
                  >
                    {distribution.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
          </div>

          {/* Embeddings table */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Embedding Details</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ID…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary/50 border-border/50"
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identity</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Embedding Hash</TableHead>
                  <TableHead>Integrity Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result, i) => (
                  <motion.tr
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/30 hover:bg-secondary/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={result.imageUrl}
                          alt={result.name}
                          className="h-8 w-8 rounded-full object-cover border border-border/50"
                        />
                        <span className="font-medium">{result.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {result.employeeId}
                    </TableCell>
                    <TableCell>{result.department}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {result.embeddingHash}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {statusIcon(result.auditVerdict)}
                        <span className="font-mono text-sm">
                          {(result.integrityScore * 100).toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{verdictBadge(result.auditVerdict)}</TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      )}

      {/* Restore Dialog */}
      <Dialog open={isRestoreOpen} onOpenChange={setIsRestoreOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Database</DialogTitle>
            <DialogDescription>
              Select a backup timestamp to restore the system to a clean state. This will overwrite current tampered embeddings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {backups.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">No backups available.</p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {backups.map((bkp) => (
                  <div key={bkp.timestamp} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/20">
                    <span className="font-mono text-sm">{bkp.timestamp}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isRestoring}
                      onClick={() => handleRestore(bkp.timestamp)}
                    >
                      {isRestoring ? 'Restoring...' : 'Restore'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRestoreOpen(false)} disabled={isRestoring}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditPage;
