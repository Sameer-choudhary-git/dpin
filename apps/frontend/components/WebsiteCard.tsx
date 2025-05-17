
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ExternalLink, Shield, AlertTriangle, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import StatusTimeline from './StatusTimeline';
import { Website } from '@/types/website';
import SecurityIndicator from './SecurityIndicator';
import ResponseTimeChart from './ResponseTimeChart';

interface WebsiteCardProps {
  website: Website;
  onDelete: (websiteId: string) => void;
}

const WebsiteCard = ({ website, onDelete }: WebsiteCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

  const handleDelete = () => {
    onDelete(website.id);
    toast({
      title: "Website removed",
      description: `${website.url} has been removed from monitoring.`,
    });
  };

  const getStatusDot = () => {
    if (website.uptime >= 99) {
      return <span className="status-dot online"></span>;
    } else if (website.uptime >= 95) {
      return <span className="status-dot issue"></span>;
    } else if (website.uptime >= 90) {
      return <span className="status-dot warning"></span>;
    } else {
      return <span className="status-dot offline"></span>;
    }
  };

  return (
    <Card className="card-gradient mb-4 overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center">
          {getStatusDot()}
          <span className="font-medium text-lg ml-2">{website.url}</span>
          {website.securityThreats > 0 && (
            <div className="ml-3">
              <Shield className="h-5 w-5 text-alert-high inline-block threat-pulse" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">
            {website.uptime.toFixed(1)}% uptime • latency: {website.latency}ms
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t border-border animate-accordion-down">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-medium mb-1 text-muted-foreground">Last 30 minutes status</h3>
              <StatusTimeline statuses={website.statusHistory} />
              <p className="text-xs text-muted-foreground mt-2">
                Last checked: {website.lastChecked}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1 text-muted-foreground">Security</h3>
              <SecurityIndicator 
                threatLevel={website.securityThreats > 5 ? 'high' : website.securityThreats > 0 ? 'medium' : 'low'} 
                threatCount={website.securityThreats}
                ddosAttempts={website.ddosAttempts}
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Response Time (last 24h)</h3>
            <div className="h-40">
              <ResponseTimeChart data={website.responseTimes} />
            </div>
          </div>
          
          <div className="mt-4 flex gap-4">
            <div>
              <h4 className="text-xs font-medium text-muted-foreground">HTTP Status</h4>
              <p className="text-sm">{website.httpStatus}</p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-muted-foreground">SSL Expiry</h4>
              <p className="text-sm">{website.sslExpiry || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-muted-foreground">Server</h4>
              <p className="text-sm">{website.server || 'Unknown'}</p>
            </div>
          </div>

          <div className="flex justify-between mt-4 pt-4 border-t border-border">
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Site
              </Button>
              <Button size="sm" variant="outline">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Configure Alerts
              </Button>
            </div>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default WebsiteCard;
