
import React from 'react';
import { Globe, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onAddWebsite: () => void;
}

const DashboardHeader = ({ onAddWebsite }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <Globe className="h-8 w-8 text-guardian-500" />
        <h1 className="text-2xl font-bold">Web Guardian</h1>
      </div>
      <Button onClick={onAddWebsite} className="bg-guardian-600 hover:bg-guardian-700">
        <Plus className="mr-2 h-4 w-4" />
        Add Website
      </Button>
    </div>
  );
};

export default DashboardHeader;
