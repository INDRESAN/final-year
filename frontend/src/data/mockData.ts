// Mock data for DeepAudit demo

export interface EnrolledIdentity {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  enrolledAt: string;
  status: 'verified' | 'pending' | 'tampered';
  imageUrl: string;
  embeddingHash: string;
}

export interface RecognitionLog {
  id: string;
  timestamp: string;
  identityId: string | null;
  identityName: string | null;
  similarity: number;
  decision: 'accepted' | 'rejected';
  watermarkValid: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  eventType: 'enrollment' | 'recognition' | 'audit' | 'login' | 'tampering_detected';
  userId: string;
  userName: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface SystemStats {
  totalEnrolled: number;
  recognitionsToday: number;
  verifiedEmbeddings: number;
  tamperedEmbeddings: number;
  pendingAudits: number;
  systemHealth: number;
}

// Mock enrolled identities
export const mockIdentities: EnrolledIdentity[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    employeeId: 'EMP001',
    department: 'Engineering',
    enrolledAt: '2024-01-15T09:30:00Z',
    status: 'verified',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    embeddingHash: 'a7f3b2c1d4e5...',
  },
  {
    id: '2',
    name: 'Michael Chen',
    employeeId: 'EMP002',
    department: 'Security',
    enrolledAt: '2024-01-16T14:20:00Z',
    status: 'verified',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    embeddingHash: 'b8g4c3d2e6f7...',
  },
  {
    id: '3',
    name: 'Emily Davis',
    employeeId: 'EMP003',
    department: 'Research',
    enrolledAt: '2024-01-17T11:45:00Z',
    status: 'tampered',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    embeddingHash: 'c9h5d4e3f7g8...',
  },
  {
    id: '4',
    name: 'James Wilson',
    employeeId: 'EMP004',
    department: 'Operations',
    enrolledAt: '2024-01-18T08:15:00Z',
    status: 'verified',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    embeddingHash: 'd0i6e5f4g8h9...',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    employeeId: 'EMP005',
    department: 'Finance',
    enrolledAt: '2024-01-19T16:00:00Z',
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    embeddingHash: 'e1j7f6g5h9i0...',
  },
];

// Mock recognition logs
export const mockRecognitionLogs: RecognitionLog[] = [
  {
    id: '1',
    timestamp: '2024-01-20T09:15:00Z',
    identityId: '1',
    identityName: 'Sarah Johnson',
    similarity: 0.94,
    decision: 'accepted',
    watermarkValid: true,
  },
  {
    id: '2',
    timestamp: '2024-01-20T09:45:00Z',
    identityId: null,
    identityName: null,
    similarity: 0.45,
    decision: 'rejected',
    watermarkValid: false,
  },
  {
    id: '3',
    timestamp: '2024-01-20T10:30:00Z',
    identityId: '2',
    identityName: 'Michael Chen',
    similarity: 0.89,
    decision: 'accepted',
    watermarkValid: true,
  },
  {
    id: '4',
    timestamp: '2024-01-20T11:00:00Z',
    identityId: '4',
    identityName: 'James Wilson',
    similarity: 0.92,
    decision: 'accepted',
    watermarkValid: true,
  },
  {
    id: '5',
    timestamp: '2024-01-20T11:30:00Z',
    identityId: '3',
    identityName: 'Emily Davis',
    similarity: 0.88,
    decision: 'rejected',
    watermarkValid: false,
  },
];

// Mock audit logs - generate a larger dataset for pagination demo
const baseAuditLogs: AuditLog[] = [
  { id: '1', timestamp: '2024-01-20T09:00:00Z', eventType: 'login', userId: '1', userName: 'Alex Morgan', details: 'Admin login successful', status: 'success' },
  { id: '2', timestamp: '2024-01-20T09:15:00Z', eventType: 'recognition', userId: '2', userName: 'Jordan Chen', details: 'Face recognition: Sarah Johnson - ACCEPTED', status: 'success' },
  { id: '3', timestamp: '2024-01-20T09:45:00Z', eventType: 'recognition', userId: '2', userName: 'Jordan Chen', details: 'Face recognition: Unknown - REJECTED', status: 'warning' },
  { id: '4', timestamp: '2024-01-20T10:00:00Z', eventType: 'audit', userId: '3', userName: 'Sam Rivera', details: 'Integrity audit initiated', status: 'success' },
  { id: '5', timestamp: '2024-01-20T10:05:00Z', eventType: 'tampering_detected', userId: '3', userName: 'Sam Rivera', details: 'Watermark verification failed for Emily Davis (EMP003)', status: 'error' },
  { id: '6', timestamp: '2024-01-20T10:30:00Z', eventType: 'enrollment', userId: '2', userName: 'Jordan Chen', details: 'New identity enrolled: Robert Kim', status: 'success' },
  { id: '7', timestamp: '2024-01-20T11:00:00Z', eventType: 'login', userId: '4', userName: 'Taylor Brooks', details: 'Operator login successful', status: 'success' },
  { id: '8', timestamp: '2024-01-20T11:15:00Z', eventType: 'recognition', userId: '4', userName: 'Taylor Brooks', details: 'Face recognition: Michael Chen - ACCEPTED', status: 'success' },
  { id: '9', timestamp: '2024-01-20T11:30:00Z', eventType: 'enrollment', userId: '4', userName: 'Taylor Brooks', details: 'New identity enrolled: Diana Patel', status: 'success' },
  { id: '10', timestamp: '2024-01-20T12:00:00Z', eventType: 'recognition', userId: '2', userName: 'Jordan Chen', details: 'Face recognition: James Wilson - ACCEPTED', status: 'success' },
  { id: '11', timestamp: '2024-01-20T12:15:00Z', eventType: 'audit', userId: '3', userName: 'Sam Rivera', details: 'Scheduled integrity check completed', status: 'success' },
  { id: '12', timestamp: '2024-01-20T12:45:00Z', eventType: 'recognition', userId: '4', userName: 'Taylor Brooks', details: 'Face recognition: Unknown - REJECTED', status: 'warning' },
  { id: '13', timestamp: '2024-01-20T13:00:00Z', eventType: 'login', userId: '5', userName: 'Casey Nguyen', details: 'Auditor login successful', status: 'success' },
  { id: '14', timestamp: '2024-01-20T13:20:00Z', eventType: 'tampering_detected', userId: '5', userName: 'Casey Nguyen', details: 'Hash mismatch detected for record EMP007', status: 'error' },
  { id: '15', timestamp: '2024-01-20T13:30:00Z', eventType: 'enrollment', userId: '2', userName: 'Jordan Chen', details: 'New identity enrolled: Marcus Lee', status: 'success' },
  { id: '16', timestamp: '2024-01-20T14:00:00Z', eventType: 'recognition', userId: '4', userName: 'Taylor Brooks', details: 'Face recognition: Lisa Anderson - ACCEPTED', status: 'success' },
  { id: '17', timestamp: '2024-01-20T14:15:00Z', eventType: 'audit', userId: '3', userName: 'Sam Rivera', details: 'Manual audit triggered for department: Security', status: 'success' },
  { id: '18', timestamp: '2024-01-20T14:30:00Z', eventType: 'recognition', userId: '2', userName: 'Jordan Chen', details: 'Face recognition: Unknown individual - REJECTED', status: 'warning' },
  { id: '19', timestamp: '2024-01-20T15:00:00Z', eventType: 'login', userId: '1', userName: 'Alex Morgan', details: 'Admin session renewed', status: 'success' },
  { id: '20', timestamp: '2024-01-20T15:10:00Z', eventType: 'enrollment', userId: '4', userName: 'Taylor Brooks', details: 'Identity updated: Sarah Johnson - photo refresh', status: 'success' },
  { id: '21', timestamp: '2024-01-20T15:30:00Z', eventType: 'tampering_detected', userId: '5', userName: 'Casey Nguyen', details: 'Embedding drift detected for EMP002 - re-verification required', status: 'error' },
  { id: '22', timestamp: '2024-01-20T15:45:00Z', eventType: 'recognition', userId: '4', userName: 'Taylor Brooks', details: 'Face recognition: Robert Kim - ACCEPTED', status: 'success' },
  { id: '23', timestamp: '2024-01-20T16:00:00Z', eventType: 'audit', userId: '3', userName: 'Sam Rivera', details: 'Full system integrity scan completed - 3 issues found', status: 'warning' },
  { id: '24', timestamp: '2024-01-20T16:30:00Z', eventType: 'login', userId: '6', userName: 'Morgan Blake', details: 'Failed login attempt - invalid credentials', status: 'error' },
  { id: '25', timestamp: '2024-01-20T16:45:00Z', eventType: 'recognition', userId: '2', userName: 'Jordan Chen', details: 'Face recognition: Diana Patel - ACCEPTED', status: 'success' },
];

export const mockAuditLogs: AuditLog[] = baseAuditLogs;

// Mock system stats
export const mockSystemStats: SystemStats = {
  totalEnrolled: 247,
  recognitionsToday: 89,
  verifiedEmbeddings: 239,
  tamperedEmbeddings: 3,
  pendingAudits: 5,
  systemHealth: 98.2,
};

// Chart data for recognition activity
export const mockActivityData = [
  { hour: '06:00', attempts: 12 },
  { hour: '07:00', attempts: 28 },
  { hour: '08:00', attempts: 45 },
  { hour: '09:00', attempts: 62 },
  { hour: '10:00', attempts: 51 },
  { hour: '11:00', attempts: 38 },
  { hour: '12:00', attempts: 25 },
  { hour: '13:00', attempts: 32 },
  { hour: '14:00', attempts: 48 },
  { hour: '15:00', attempts: 55 },
  { hour: '16:00', attempts: 42 },
  { hour: '17:00', attempts: 35 },
];

// Audit status distribution
export const mockAuditDistribution = [
  { name: 'Verified', value: 239, color: 'hsl(142, 71%, 45%)' },
  { name: 'Pending', value: 5, color: 'hsl(38, 92%, 50%)' },
  { name: 'Tampered', value: 3, color: 'hsl(0, 84%, 60%)' },
];
