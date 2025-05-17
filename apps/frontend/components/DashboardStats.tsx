
import React from 'react';
import { Card } from '@/components/ui/card';
import { Shield, Activity, BarChart2, AlertTriangle } from 'lucide-react';

interface DashboardStatsProps {
  totalWebsites: number;
  averageUptime: number;
  totalThreats: number;
  totalDdosAttempts: number;
}

const DashboardStats = ({ 
  totalWebsites, 
  averageUptime, 
  totalThreats,
  totalDdosAttempts 
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        title="Monitored Websites" 
        value={totalWebsites.toString()} 
        icon={<BarChart2 className="h-5 w-5 text-guardian-500" />} 
        description="Total websites being monitored"
      />
      <StatCard 
        title="Average Uptime" 
        value={`${averageUptime.toFixed(2)}%`} 
        icon={<Activity className="h-5 w-5 text-guardian-500" />} 
        description="Across all websites"
        status={averageUptime >= 99 ? 'success' : 'warning'}
      />
      <StatCard 
        title="Total Security Threats" 
        value={totalThreats.toString()} 
        icon={<Shield className="h-5 w-5 text-guardian-500" />} 
        description="Detected in last 24 hours"
        status={totalThreats > 0 ? 'danger' : 'success'}
      />
      <StatCard 
        title="DDoS Attempts" 
        value={totalDdosAttempts.toString()} 
        icon={<AlertTriangle className="h-5 w-5 text-guardian-500" />} 
        description="Blocked in last 24 hours"
        status={totalDdosAttempts > 0 ? 'danger' : 'success'}
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  status?: 'success' | 'warning' | 'danger';
}

const StatCard = ({ title, value, icon, description, status }: StatCardProps) => {
  const getStatusColor = () => {
    if (!status) return '';
    
    switch (status) {
      case 'success':
        return 'text-alert-low';
      case 'warning':
        return 'text-alert-medium';
      case 'danger':
        return 'text-alert-critical';
      default:
        return '';
    }
  };
  
  return (
    <Card className="p-4 card-gradient">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className={`text-2xl font-bold mt-1 ${getStatusColor()}`}>{value}</h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="p-2 bg-secondary rounded-md">
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default DashboardStats;
