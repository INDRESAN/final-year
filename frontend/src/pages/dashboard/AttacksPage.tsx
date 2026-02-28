import React, { useState } from 'react';
import { Fingerprint, Zap, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/api/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const AttacksPage = () => {
    const [targetUser, setTargetUser] = useState('');
    const [magnitude, setMagnitude] = useState(0.15);
    const [isSimulating, setIsSimulating] = useState(false);

    const handleTargetedAttack = async () => {
        if (!targetUser) {
            toast.error('Please specify a target user');
            return;
        }

        setIsSimulating(true);
        try {
            const response = await api.post('/attack/perturbation', {
                target_user: targetUser,
                magnitude: Number(magnitude)
            });

            if (response.data.success) {
                toast.success('Targeted Attack Successful', {
                    description: `Perturbation applied to user ${targetUser}`,
                });
            }
        } catch (error: any) {
            toast.error('Attack Simulation Failed', {
                description: error.response?.data?.detail || 'Could not execute targeted attack',
            });
        } finally {
            setIsSimulating(false);
        }
    };

    const handleMassAttack = async () => {
        setIsSimulating(true);
        try {
            const response = await api.post('/attack/mass-perturbation', {
                magnitude: Number(magnitude)
            });

            if (response.data.success) {
                toast.warning('Mass Attack Executed', {
                    description: `Perturbation applied to ${response.data.database_status?.users_affected || 'all'} users. Database Severely Compromised.`,
                });
            }
        } catch (error: any) {
            toast.error('Mass Attack Failed', {
                description: error.response?.data?.detail || 'Could not execute mass attack',
            });
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-destructive">
                        <Zap className="h-6 w-6" /> Attack Simulations
                    </h1>
                    <p className="text-muted-foreground">
                        Test system resilience by simulating data poisoning and tampering attacks
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Targeted Attack */}
                <Card className="border-destructive/20 bg-destructive/5 glass">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Fingerprint className="h-5 w-5 text-destructive" /> Targeted Poisoning
                        </CardTitle>
                        <CardDescription>
                            Modify a specific user's embedding vector to test identity spoofing and tampering alerts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Target Username</label>
                            <Input
                                placeholder="e.g., indresan"
                                value={targetUser}
                                onChange={(e) => setTargetUser(e.target.value)}
                                className="bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Noise Magnitude (0.01 - 1.0)</label>
                            <Input
                                type="number"
                                step="0.05"
                                min="0.01"
                                max="1.0"
                                value={magnitude}
                                onChange={(e) => setMagnitude(Number(e.target.value))}
                                className="bg-background"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="destructive"
                            className="w-full shadow-[0_0_15px_rgba(239,35,60,0.3)] transition-all hover:shadow-[0_0_25px_rgba(239,35,60,0.5)]"
                            onClick={handleTargetedAttack}
                            disabled={isSimulating}
                        >
                            Execute Targeted Attack
                        </Button>
                    </CardFooter>
                </Card>

                {/* Mass Attack */}
                <Card className="border-warning/30 bg-warning/5 glass">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-warning" /> Mass Perturbation (Database Wipe)
                        </CardTitle>
                        <CardDescription>
                            Inject widespread noise across all stored embeddings to trigger critical system alerts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Global Noise Magnitude</label>
                            <Input
                                type="number"
                                step="0.05"
                                min="0.01"
                                max="1.0"
                                value={magnitude}
                                onChange={(e) => setMagnitude(Number(e.target.value))}
                                className="bg-background"
                            />
                        </div>
                        <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                            <p className="text-sm text-warning font-medium flex gap-2">
                                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                This action will compromise the entire database and require an immediate restoration from the Audit page!
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="mt-auto">
                        <Button
                            variant="default"
                            className="w-full bg-warning hover:bg-warning/80 text-warning-foreground shadow-[0_0_15px_rgba(255,170,0,0.2)] transition-all hover:shadow-[0_0_25px_rgba(255,170,0,0.4)]"
                            onClick={handleMassAttack}
                            disabled={isSimulating}
                        >
                            Execute Mass Attack
                        </Button>
                    </CardFooter>
                </Card>

            </div>
        </div>
    );
};

export default AttacksPage;
