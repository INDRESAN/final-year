import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, ScanFace, Save, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const defaults = {
  matchThreshold: 85,
  tamperThreshold: 50,
  autoRejectBelow: 30,
  tamperToasts: true,
  auditSummary: true,
  enrollmentAlerts: true,
  emailDigest: false,
  digestFrequency: 'daily',
  digestEmail: '',
};

const SettingsPage = () => {
  const [matchThreshold, setMatchThreshold] = useState(defaults.matchThreshold);
  const [tamperThreshold, setTamperThreshold] = useState(defaults.tamperThreshold);
  const [autoRejectBelow, setAutoRejectBelow] = useState(defaults.autoRejectBelow);

  const [tamperToasts, setTamperToasts] = useState(defaults.tamperToasts);
  const [auditSummary, setAuditSummary] = useState(defaults.auditSummary);
  const [enrollmentAlerts, setEnrollmentAlerts] = useState(defaults.enrollmentAlerts);
  const [emailDigest, setEmailDigest] = useState(defaults.emailDigest);
  const [digestFrequency, setDigestFrequency] = useState(defaults.digestFrequency);
  const [digestEmail, setDigestEmail] = useState(defaults.digestEmail);

  const handleSave = () => {
    toast.success('Settings saved', { description: 'Your preferences have been updated.' });
  };

  const handleReset = () => {
    setMatchThreshold(defaults.matchThreshold);
    setTamperThreshold(defaults.tamperThreshold);
    setAutoRejectBelow(defaults.autoRejectBelow);
    setTamperToasts(defaults.tamperToasts);
    setAuditSummary(defaults.auditSummary);
    setEnrollmentAlerts(defaults.enrollmentAlerts);
    setEmailDigest(defaults.emailDigest);
    setDigestFrequency(defaults.digestFrequency);
    setDigestEmail(defaults.digestEmail);
    toast.info('Settings reset to defaults');
  };

  const thresholdColor = (val: number) =>
    val >= 80 ? 'text-green-500' : val >= 50 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" /> Settings
          </h1>
          <p className="text-muted-foreground">Configure recognition thresholds and notification preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" /> Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Similarity Thresholds */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ScanFace className="w-5 h-5 text-primary" /> Recognition Thresholds
              </CardTitle>
              <CardDescription>Set confidence levels for identity matching and tamper detection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Match threshold */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Match Acceptance Threshold</Label>
                  <Badge variant="outline" className={thresholdColor(matchThreshold)}>
                    {matchThreshold}%
                  </Badge>
                </div>
                <Slider
                  value={[matchThreshold]}
                  onValueChange={([v]) => setMatchThreshold(v)}
                  min={50}
                  max={99}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum similarity score to accept a face match. Higher = stricter.
                </p>
              </div>

              <Separator />

              {/* Tamper threshold */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Tamper Detection Threshold</Label>
                  <Badge variant="outline" className={thresholdColor(tamperThreshold)}>
                    {tamperThreshold}%
                  </Badge>
                </div>
                <Slider
                  value={[tamperThreshold]}
                  onValueChange={([v]) => setTamperThreshold(v)}
                  min={10}
                  max={80}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">
                  Integrity scores below this value flag an embedding as tampered.
                </p>
              </div>

              <Separator />

              {/* Auto-reject */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Auto-Reject Below</Label>
                  <Badge variant="outline" className={thresholdColor(autoRejectBelow)}>
                    {autoRejectBelow}%
                  </Badge>
                </div>
                <Slider
                  value={[autoRejectBelow]}
                  onValueChange={([v]) => setAutoRejectBelow(v)}
                  min={5}
                  max={60}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">
                  Matches below this score are automatically rejected without review.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="w-5 h-5 text-primary" /> Notification Preferences
              </CardTitle>
              <CardDescription>Control which alerts and notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Tamper Detection Toasts</Label>
                  <p className="text-xs text-muted-foreground">Show real-time alerts during audit scans</p>
                </div>
                <Switch checked={tamperToasts} onCheckedChange={setTamperToasts} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Audit Summary Notifications</Label>
                  <p className="text-xs text-muted-foreground">Show completion summary after each scan</p>
                </div>
                <Switch checked={auditSummary} onCheckedChange={setAuditSummary} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enrollment Alerts</Label>
                  <p className="text-xs text-muted-foreground">Notify when new identities are enrolled</p>
                </div>
                <Switch checked={enrollmentAlerts} onCheckedChange={setEnrollmentAlerts} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Digest</Label>
                  <p className="text-xs text-muted-foreground">Receive periodic audit summaries via email</p>
                </div>
                <Switch checked={emailDigest} onCheckedChange={setEmailDigest} />
              </div>

              {emailDigest && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pl-1"
                >
                  <div className="space-y-2">
                    <Label>Digest Email</Label>
                    <Input
                      type="email"
                      placeholder="admin@company.com"
                      value={digestEmail}
                      onChange={(e) => setDigestEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select value={digestFrequency} onValueChange={setDigestFrequency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
