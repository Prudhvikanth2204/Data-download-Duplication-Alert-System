
import React from 'react';
import { Server, Database } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface StorageToggleProps {
  usePostgres: boolean;
  onToggleChange: (checked: boolean) => void;
}

const StorageToggle = ({
  usePostgres,
  onToggleChange
}: StorageToggleProps) => {
  return (
    <div className="flex items-center justify-between mb-4 p-2 border rounded-md bg-gray-50">
      <div className="flex items-center space-x-2">
        {usePostgres ? (
          <Server className="h-4 w-4 text-ddas-blue" />
        ) : (
          <Database className="h-4 w-4 text-gray-500" />
        )}
        <Label htmlFor="postgres-mode" className="flex items-center cursor-pointer">
          Storage Mode:
        </Label>
        <Badge variant={usePostgres ? "default" : "outline"} className="ml-2">
          {usePostgres ? "PostgreSQL" : "Local Storage"}
        </Badge>
      </div>
      <Switch 
        id="postgres-mode" 
        checked={usePostgres} 
        onCheckedChange={onToggleChange} 
        className="data-[state=checked]:bg-ddas-blue"
      />
    </div>
  );
};

export default StorageToggle;
