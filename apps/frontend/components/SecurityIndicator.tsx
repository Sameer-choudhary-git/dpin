
import React from 'react';
import { Shield, AlertTriangle, Activity } from 'lucide-react';

type ThreatLevel = 'low' | 'medium' | 'high';

interface SecurityIndicatorProps {
  threatLevel: ThreatLevel;
  threatCount: number;
  ddosAttempts: number;
}

const SecurityIndicator = ({ threatLevel, threatCount, ddosAttempts }: SecurityIndicatorProps) => {
  const getIndicatorColor = () => {
    switch (threatLevel) {
      case 'high':
        return 'text-alert-critical';
      case 'medium':
        return 'text-alert-high';
      case 'low':
        return 'text-alert-low';
      default:
        return 'text-gray-400';
    }
  };

  const getThreatText = () => {
    switch (threatLevel) {
      case 'high':
        return 'Critical security threats detected!';
      case 'medium':
        return 'Security threats detected';
      case 'low':
        return 'No security threats detected';
      default:
        return 'Security status unknown';
    }
  };

  return (
    <div className="p-3 rounded-md bg-secondary flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Shield className={`h-5 w-5 ${getIndicatorColor()} ${threatLevel !== 'low' ? 'threat-pulse' : ''}`} />
        <span className={`text-sm font-medium ${getIndicatorColor()}`}>{getThreatText()}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-1">
        <div className="flex items-center gap-1">
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Threats: {threatCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">DDoS attempts: {ddosAttempts}</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityIndicator;
