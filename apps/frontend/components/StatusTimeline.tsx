
import React from 'react';

interface StatusTimelineProps {
  statuses: ('online' | 'offline' | 'warning' | 'issue')[];
}

const StatusTimeline = ({ statuses }: StatusTimelineProps) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online':
        return 'bg-alert-low';
      case 'offline':
        return 'bg-alert-critical';
      case 'warning':
        return 'bg-alert-high';
      case 'issue':
        return 'bg-alert-medium';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="status-timeline">
      {statuses.map((status, index) => (
        <div 
          key={index}
          className={`status-timeline-item ${getStatusColor(status)}`}
          title={`Status: ${status}`}
        />
      ))}
    </div>
  );
};

export default StatusTimeline;
