
import React from 'react';
import { Database, Cpu } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { setUseMockData, getUseMockData } from '@/utils/checksumService';

interface DataSourceToggleProps {
  onChange?: (isMockData: boolean) => void;
}

const DataSourceToggle: React.FC<DataSourceToggleProps> = ({ onChange }) => {
  const [useMock, setUseMock] = React.useState(getUseMockData());
  
  const handleToggleChange = (checked: boolean) => {
    setUseMock(checked);
    setUseMockData(checked);
    if (onChange) {
      onChange(checked);
    }
  };

  return (
    <div className="flex items-center justify-between mb-4 p-2 border rounded-md bg-gray-50">
      <div className="flex items-center space-x-2">
        {useMock ? (
          <Cpu className="h-4 w-4 text-amber-500" />
        ) : (
          <Database className="h-4 w-4 text-ddas-blue" />
        )}
        <Label htmlFor="data-source" className="flex items-center cursor-pointer">
          Data Source:
        </Label>
        <Badge variant={useMock ? "outline" : "default"} className="ml-2">
          {useMock ? "Mock Data" : "Real API"}
        </Badge>
      </div>
      <Switch 
        id="data-source" 
        checked={useMock} 
        onCheckedChange={handleToggleChange} 
        className="data-[state=checked]:bg-amber-500"
      />
    </div>
  );
};

export default DataSourceToggle;
