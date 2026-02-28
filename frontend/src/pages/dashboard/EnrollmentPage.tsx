import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import WebcamCapture from '@/components/enrollment/WebcamCapture';
import FacePreview from '@/components/enrollment/FacePreview';
import EnrollmentForm from '@/components/enrollment/EnrollmentForm';
import EmbeddingVisualizer from '@/components/enrollment/EmbeddingVisualizer';
import api from '@/api/client';
import { useAuth } from '@/contexts/AuthContext';

type Step = 'capture' | 'preview' | 'details' | 'complete';
type EmbeddingStage = 'idle' | 'generating' | 'generated' | 'watermarking' | 'complete';

const STEPS: { key: Step; label: string }[] = [
  { key: 'capture', label: 'Capture' },
  { key: 'preview', label: 'Preview' },
  { key: 'details', label: 'Enroll' },
  { key: 'complete', label: 'Done' },
];

const EnrollmentPage = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('capture');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [embeddingStage, setEmbeddingStage] = useState<EmbeddingStage>('idle');
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({ name: '', employeeId: '', department: '' });

  const handleCapture = useCallback((imageSrc: string) => {
    setCapturedImage(imageSrc);
    setStep('preview');
  }, []);

  const handleConfirmFace = () => setStep('details');
  const handleRetake = () => {
    setCapturedImage(null);
    setStep('capture');
  };

  const simulateProgress = (duration: number, onComplete: () => void) => {
    setProgress(0);
    const interval = 50;
    const steps = duration / interval;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      setProgress(Math.min(Math.round((current / steps) * 100), 100));
      if (current >= steps) {
        clearInterval(timer);
        onComplete();
      }
    }, interval);
  };

  const handleGenerateEmbedding = async () => {
    if (!formData.name || !formData.employeeId || !formData.department) {
      toast({ title: 'Missing fields', description: 'Please fill in all identity details.', variant: 'destructive' });
      return;
    }
    if (!capturedImage) {
      toast({ title: 'Missing image', description: 'Please capture a face image first.', variant: 'destructive' });
      return;
    }

    setEmbeddingStage('generating');
    setProgress(50);
    // Move to next stage for watermarking step handling in backend
    setTimeout(() => {
      setEmbeddingStage('generated');
      setProgress(100);
      toast({ title: 'Embedding generated', description: 'Ready for watermarking and secure save.' });
    }, 1000);
  };

  const handleWatermarkAndSave = async () => {
    setEmbeddingStage('watermarking');
    setProgress(30);

    try {
      const base64Data = capturedImage.includes(',') ? capturedImage.split(',')[1] : capturedImage;
      const response = await api.post('/enroll', {
        username: formData.name,
        admin_username: user?.email?.split('@')[0] || 'admin',
        image_base64: base64Data
      });

      setProgress(100);
      setEmbeddingStage('complete');
      setStep('complete');

      toast({
        title: 'Enrollment complete!',
        description: response.data.message || `${formData.name} has been enrolled securely.`,
        variant: "default"
      });
    } catch (error: any) {
      setEmbeddingStage('generated');
      toast({
        title: 'Enrollment Failed',
        description: error.response?.data?.detail || 'Failed to enroll user securely.',
        variant: "destructive"
      })
    }
  };

  const handleReset = () => {
    setStep('capture');
    setCapturedImage(null);
    setEmbeddingStage('idle');
    setProgress(0);
    setFormData({ name: '', employeeId: '', department: '' });
  };

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Face Enrollment</h1>
        <p className="text-muted-foreground">Capture and register new identities with watermarked embeddings</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.key}>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i < currentStepIndex
                  ? 'bg-accent text-accent-foreground'
                  : i === currentStepIndex
                    ? 'gradient-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                  }`}
              >
                {i < currentStepIndex ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:inline ${i === currentStepIndex ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < currentStepIndex ? 'bg-accent' : 'bg-border'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left panel: Camera / Preview */}
        <div className="glass rounded-2xl p-6">
          <AnimatePresence mode="wait">
            {step === 'capture' && (
              <motion.div key="capture" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" /> Capture Face
                </h2>
                <WebcamCapture onCapture={handleCapture} onUpload={handleCapture} />
              </motion.div>
            )}
            {(step === 'preview' || step === 'details' || step === 'complete') && capturedImage && (
              <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-lg font-semibold mb-4">Face Preview</h2>
                {step === 'preview' ? (
                  <FacePreview imageSrc={capturedImage} onRetake={handleRetake} onConfirm={handleConfirmFace} />
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-accent/40 aspect-[4/3]">
                    <img src={capturedImage} alt="Enrolled face" className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-accent/90 text-accent-foreground text-xs font-bold px-2 py-1 rounded-md">
                      ✓ Confirmed
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right panel: Form & Embedding */}
        <div className="glass rounded-2xl p-6 space-y-6">
          <AnimatePresence mode="wait">
            {step === 'capture' && (
              <motion.div key="form-placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12"
              >
                <UserPlus className="h-12 w-12 mb-4 opacity-30" />
                <p>Capture or upload a face image to begin enrollment.</p>
              </motion.div>
            )}
            {step === 'preview' && (
              <motion.div key="form-waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12"
              >
                <p>Confirm the captured face to proceed.</p>
              </motion.div>
            )}
            {step === 'details' && (
              <motion.div key="form-active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Identity Details</h2>
                  <EnrollmentForm
                    formData={formData}
                    onChange={(partial) => setFormData((prev) => ({ ...prev, ...partial }))}
                    disabled={embeddingStage !== 'idle' && embeddingStage !== 'generated'}
                  />
                </div>
                <EmbeddingVisualizer
                  stage={embeddingStage}
                  progress={progress}
                  onGenerate={handleGenerateEmbedding}
                  onWatermark={handleWatermarkAndSave}
                />
              </motion.div>
            )}
            {step === 'complete' && (
              <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-8 space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center glow-success"
                >
                  <CheckCircle2 className="h-10 w-10 text-accent" />
                </motion.div>
                <h2 className="text-xl font-bold">Enrollment Successful</h2>
                <p className="text-muted-foreground text-sm max-w-sm">
                  <strong>{formData.name}</strong> ({formData.employeeId}) has been enrolled in <strong>{formData.department}</strong> with a watermarked 128-d embedding.
                </p>
                <Button onClick={handleReset} variant="outline" className="mt-4">
                  <UserPlus className="mr-2 h-4 w-4" /> Enroll Another
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPage;
