import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ScanFace, LogOut } from 'lucide-react';
import api from '@/api/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VerificationResult {
    similarity: number;
    matchedIdentity: {
        name: string;
        employeeId: string;
        department: string;
    } | null;
}

const RealtimeVerification: React.FC = () => {
    const webcamRef = useRef<Webcam>(null);
    const [isReady, setIsReady] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [lastResult, setLastResult] = useState<VerificationResult | null>(null);
    const [sessionActive, setSessionActive] = useState(true);

    const captureAndVerify = useCallback(async () => {
        // Basic checks to ensure we can and should verify
        if (!webcamRef.current || !isReady || isVerifying || !sessionActive) return;

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        setIsVerifying(true);
        try {
            // Strip Data URI
            const base64Data = imageSrc.includes(',') ? imageSrc.split(',')[1] : imageSrc;
            const response = await api.post('/verify', { image_base64: base64Data });

            const data = response.data;
            // Match condition based on our python backend setup
            if (data.success && data.similarity_score > 0.55) {
                setLastResult({
                    similarity: data.similarity_score,
                    matchedIdentity: {
                        name: data.matched_user,
                        employeeId: 'EMP-XXX', // Could be extended to get real roll number from backend
                        department: 'Verified',
                    }
                });
            } else {
                setLastResult(null); // Clear result if no match is found for current frame
            }
        } catch (error) {
            setLastResult(null);
        } finally {
            setIsVerifying(false);
        }
    }, [isReady, isVerifying, sessionActive]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (sessionActive && isReady) {
            // Run capture-verify loop
            interval = setInterval(captureAndVerify, 2000); // 2 second interval to avoid spanming backend too hard
        }
        return () => clearInterval(interval);
    }, [captureAndVerify, isReady, sessionActive]);

    const handleStop = () => {
        setSessionActive(false);
        setLastResult(null);
    };

    const handleRestart = () => {
        setSessionActive(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Live Verification</h1>
                    <p className="text-muted-foreground">
                        Stand in front of the camera to verify your identity instantly.
                    </p>
                </div>
                <div>
                    {sessionActive ? (
                        <Button variant="destructive" onClick={handleStop} className="gap-2">
                            <LogOut className="h-4 w-4" /> Stop Camera
                        </Button>
                    ) : (
                        <Button onClick={handleRestart} className="gap-2">
                            <ScanFace className="h-4 w-4" /> Start Camera
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">

                {/* Left: Camera View */}
                <div className="glass rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                    {sessionActive ? (
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-primary/20 bg-black flex items-center justify-center">
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{ facingMode: 'user', width: 640, height: 480 }}
                                onUserMedia={() => setIsReady(true)}
                                onUserMediaError={() => setIsReady(false)}
                                className="w-full h-full object-cover shadow-inner"
                                mirrored={true}
                            />
                            {/* Scanning laser overlay effect */}
                            <AnimatePresence>
                                {isReady && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 pointer-events-none"
                                    >
                                        <motion.div
                                            animate={{ top: ['0%', '100%', '0%'] }}
                                            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                                            className="absolute left-0 w-full h-[2px] bg-primary/70 shadow-[0_0_15px_rgba(var(--primary),0.9)]"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="w-full aspect-[4/3] rounded-xl bg-muted/20 flex flex-col items-center justify-center border border-dashed border-border/50">
                            <ScanFace className="h-16 w-16 mb-4 text-muted-foreground/40" />
                            <p className="text-muted-foreground font-medium">Camera is turned off</p>
                        </div>
                    )}
                </div>

                {/* Right: Results View */}
                <div className="glass rounded-2xl p-6 flex items-center justify-center min-h-[400px] border border-accent/10 relative overflow-hidden">

                    {/* Success Background Glow */}
                    <AnimatePresence>
                        {lastResult?.matchedIdentity && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-accent/5 pointer-events-none"
                            />
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {lastResult?.matchedIdentity ? (
                            <motion.div
                                key="matched"
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="flex flex-col items-center justify-center space-y-6 w-full relative z-10"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                    className="w-28 h-28 rounded-full bg-accent/10 flex items-center justify-center shadow-[0_0_40px_hsl(var(--accent)/0.2)]"
                                >
                                    <CheckCircle2 className="h-16 w-16 text-accent drop-shadow-md" />
                                </motion.div>

                                <div className="text-center space-y-3">
                                    <p className="text-sm font-semibold text-accent uppercase tracking-wider">Identity Verified</p>
                                    <h2 className="text-4xl font-extrabold tracking-tight text-foreground">{lastResult.matchedIdentity.name}</h2>
                                    <p className="text-xl text-muted-foreground font-medium mt-2">
                                        Roll Number: <span className="text-foreground">{lastResult.matchedIdentity.employeeId}</span>
                                    </p>
                                </div>

                                <Badge variant="outline" className="mt-8 bg-background border-accent/30 text-accent px-4 py-1.5 text-sm flex items-center gap-2">
                                    <ScanFace className="w-4 h-4" />
                                    Match Confidence: {(lastResult.similarity * 100).toFixed(1)}%
                                </Badge>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="searching"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center text-center space-y-6 text-muted-foreground max-w-[250px]"
                            >
                                <div className="relative flex items-center justify-center w-24 h-24 mb-2">
                                    <ScanFace className="h-14 w-14 opacity-20" />
                                    {sessionActive && (
                                        <motion.div
                                            className="absolute inset-0 border-[3px] border-primary/40 rounded-full border-t-primary"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                        />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xl font-bold text-foreground/70">
                                        {sessionActive ? "Scanning Face..." : "System Ready"}
                                    </p>
                                    <p className="text-sm">
                                        {sessionActive
                                            ? "Looking for a match in the database. Please look directly at the camera."
                                            : "Start the camera to begin realtime verification."}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};

export default RealtimeVerification;
