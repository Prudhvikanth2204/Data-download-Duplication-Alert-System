
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface AlertBannerProps {
  message: string;
  onDismiss: () => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ message, onDismiss }) => {
  return (
    <Alert className="bg-yellow-50 border-yellow-200 text-ddas-yellow mb-4 animate-pulse-slow">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription className="text-sm text-ddas-yellow">
            {message}
          </AlertDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onDismiss} className="text-ddas-yellow p-0 h-auto">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
};

export default AlertBanner;
