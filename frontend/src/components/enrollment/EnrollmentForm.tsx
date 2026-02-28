import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EnrollmentFormProps {
  formData: { name: string; employeeId: string; department: string };
  onChange: (data: Partial<{ name: string; employeeId: string; department: string }>) => void;
  disabled?: boolean;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ formData, onChange, disabled }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Enter full name"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="employeeId">Employee ID</Label>
        <Input
          id="employeeId"
          placeholder="e.g. EMP006"
          value={formData.employeeId}
          onChange={(e) => onChange({ employeeId: e.target.value })}
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select
          value={formData.department}
          onValueChange={(val) => onChange({ department: val })}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
            <SelectItem value="Research">Research</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EnrollmentForm;
