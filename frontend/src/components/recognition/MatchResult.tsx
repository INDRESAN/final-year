import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ShieldCheck, ShieldAlert, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SimilarityGauge from './SimilarityGauge';

interface MatchResultProps {
  similarity: number;
  decision: 'accepted' | 'rejected';
  watermarkValid: boolean;
  matchedIdentity: {
    name: string;
    employeeId: string;
    department: string;
    imageUrl: string;
  } | null;
  capturedImage: string;
}

const MatchResult = React.forwardRef<HTMLDivElement, MatchResultProps>(({
  similarity,
  decision,
  watermarkValid,
  matchedIdentity,
  capturedImage,
}, ref) => {
  const accepted = decision === 'accepted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Decision banner */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`rounded-xl p-4 flex items-center gap-3 border ${
          accepted
            ? 'bg-accent/10 border-accent/30'
            : 'bg-destructive/10 border-destructive/30'
        }`}
        style={{
          boxShadow: accepted
            ? '0 0 20px hsl(168 76% 42% / 0.15)'
            : '0 0 20px hsl(0 84% 60% / 0.15)',
        }}
      >
        {accepted ? (
          <CheckCircle2 className="h-8 w-8 text-accent shrink-0" />
        ) : (
          <XCircle className="h-8 w-8 text-destructive shrink-0" />
        )}
        <div>
          <p className={`text-lg font-bold ${accepted ? 'text-accent' : 'text-destructive'}`}>
            {accepted ? '✓ ACCEPTED' : '✗ REJECTED'}
          </p>
          <p className="text-sm text-muted-foreground">
            {accepted
              ? 'Identity verified successfully'
              : matchedIdentity
              ? 'Watermark verification failed'
              : 'No matching identity found'}
          </p>
        </div>
      </motion.div>

      {/* Similarity gauge */}
      <div className="glass rounded-xl p-5 flex flex-col items-center">
        <p className="text-sm text-muted-foreground mb-2">Similarity Score</p>
        <SimilarityGauge score={similarity} />
      </div>

      {/* Photo comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground text-center">Input</p>
          <div className="rounded-xl overflow-hidden border border-border/50 aspect-square">
            <img src={capturedImage} alt="Input" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground text-center">Matched</p>
          <div className="rounded-xl overflow-hidden border border-border/50 aspect-square bg-muted/30 flex items-center justify-center">
            {matchedIdentity ? (
              <img src={matchedIdentity.imageUrl} alt={matchedIdentity.name} className="w-full h-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-muted-foreground/30" />
            )}
          </div>
        </div>
      </div>

      {/* Identity details */}
      {matchedIdentity && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-4 space-y-3"
        >
          <p className="text-sm font-semibold">Matched Identity</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Name</p>
              <p className="font-medium">{matchedIdentity.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Employee ID</p>
              <p className="font-medium">{matchedIdentity.employeeId}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Department</p>
              <p className="font-medium">{matchedIdentity.department}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Watermark</p>
              <Badge
                variant={watermarkValid ? 'default' : 'destructive'}
                className={`text-xs ${watermarkValid ? 'bg-accent text-accent-foreground' : ''}`}
              >
                {watermarkValid ? (
                  <><ShieldCheck className="h-3 w-3 mr-1" /> Valid</>
                ) : (
                  <><ShieldAlert className="h-3 w-3 mr-1" /> Invalid</>
                )}
              </Badge>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
});
MatchResult.displayName = 'MatchResult';

export default MatchResult;
