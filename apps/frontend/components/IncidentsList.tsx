
import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Incident } from '@/types/incident';

interface IncidentsListProps {
  incidents: Incident[];
}

const IncidentsList = ({ incidents }: IncidentsListProps) => {
  if (incidents.length === 0) {
    return (
      <Card className="p-4 card-gradient">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No incidents reported</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="card-gradient">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-alert-high" />
          Recent Incidents
        </h2>
      </div>
      <div className="divide-y divide-border">
        {incidents.map((incident) => (
          <div key={incident.id} className="p-4">
            <div className="flex justify-between">
              <h3 className="font-medium text-sm">{incident.website}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getIncidentStatusClass(incident.status)}`}>
                {incident.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {incident.timestamp}
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-3 w-3 mr-1" />
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const getIncidentStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'resolved':
      return 'bg-alert-low/20 text-alert-low';
    case 'investigating':
      return 'bg-alert-high/20 text-alert-high';
    case 'identified':
      return 'bg-alert-medium/20 text-alert-medium';
    case 'monitoring':
      return 'bg-guardian-500/20 text-guardian-500';
    default:
      return 'bg-muted/20 text-muted-foreground';
  }
};

export default IncidentsList;
