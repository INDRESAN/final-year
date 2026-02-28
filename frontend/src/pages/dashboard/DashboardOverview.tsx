import { motion } from 'framer-motion';
import {
  Users,
  ScanFace,
  ShieldCheck,
  AlertTriangle,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockSystemStats, mockActivityData, mockAuditLogs, mockAuditDistribution } from '@/data/mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  color,
  delay,
}: {
  icon: any;
  label: string;
  value: string | number;
  trend?: string;
  color: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="glass border-border/50 hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 mt-2 text-success text-sm">
                <TrendingUp className="w-4 h-4" />
                {trend}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const DashboardOverview = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-success/20 text-success border-success/30">Success</Badge>;
      case 'warning':
        return <Badge className="bg-warning/20 text-warning border-warning/30">Warning</Badge>;
      case 'error':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'enrollment':
        return <Users className="w-4 h-4 text-primary" />;
      case 'recognition':
        return <ScanFace className="w-4 h-4 text-accent" />;
      case 'audit':
        return <ShieldCheck className="w-4 h-4 text-success" />;
      case 'tampering_detected':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Monitor your biometric security system in real-time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Enrolled"
          value={mockSystemStats.totalEnrolled}
          trend="+12 this week"
          color="bg-primary/20 text-primary"
          delay={0}
        />
        <StatCard
          icon={ScanFace}
          label="Recognitions Today"
          value={mockSystemStats.recognitionsToday}
          trend="+8% from yesterday"
          color="bg-accent/20 text-accent"
          delay={0.1}
        />
        <StatCard
          icon={ShieldCheck}
          label="Verified Embeddings"
          value={mockSystemStats.verifiedEmbeddings}
          color="bg-success/20 text-success"
          delay={0.2}
        />
        <StatCard
          icon={AlertTriangle}
          label="Tampered Detected"
          value={mockSystemStats.tamperedEmbeddings}
          color="bg-destructive/20 text-destructive"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recognition Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 20%)" />
                  <XAxis
                    dataKey="hour"
                    stroke="hsl(215 20% 65%)"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(215 20% 65%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222 47% 8%)',
                      border: '1px solid hsl(217 33% 20%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="attempts"
                    stroke="hsl(217 91% 60%)"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(217 91% 60%)', r: 4 }}
                    activeDot={{ r: 6, fill: 'hsl(168 76% 42%)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Audit Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glass border-border/50 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                Audit Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={mockAuditDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockAuditDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222 47% 8%)',
                      border: '1px solid hsl(217 33% 20%)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {mockAuditDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAuditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-background/50">
                    {getEventIcon(log.eventType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{log.details}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.userName} • {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {getStatusBadge(log.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
