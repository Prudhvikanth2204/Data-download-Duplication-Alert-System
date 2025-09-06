
import React from 'react';
import { Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DirectoryScanProps {
  isScanning: boolean;
  scanProgress: number;
  onDirectorySelect: () => void;
  usePostgres: boolean;
}

const DirectoryScan = ({
  isScanning,
  scanProgress,
  onDirectorySelect,
  usePostgres
}: DirectoryScanProps) => {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Folder className="h-12 w-12 text-blue-500" />
          <div>
            <p className="font-medium">Scan a directory for files</p>
            <p className="text-sm text-gray-500 mt-1">
              This will scan a directory and all its subdirectories for files, calculate checksums for all files,
              and store them in the {usePostgres ? "PostgreSQL database" : "extension database"}.
            </p>
          </div>
          <Button
            onClick={onDirectorySelect}
            disabled={isScanning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isScanning ? 'Scanning...' : 'Select Directory'}
          </Button>
        </div>
      </div>
      
      {isScanning && (
        <div className="space-y-2">
          <div className="text-sm text-gray-500 flex justify-between">
            <span>Scanning directory...</span>
            <span>{Math.round(scanProgress)}%</span>
          </div>
          <Progress value={scanProgress} />
        </div>
      )}
    </div>
  );
};

export default DirectoryScan;
