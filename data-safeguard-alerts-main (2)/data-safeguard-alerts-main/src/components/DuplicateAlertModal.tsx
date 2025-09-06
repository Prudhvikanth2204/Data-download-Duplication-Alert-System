import React from 'react';
import { AlertTriangle, X, Download, Eye, Check } from 'lucide-react';
import { FileRecord } from '@/lib/mockData';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface DuplicateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileRecord | null;
}

const DuplicateAlertModal: React.FC<DuplicateAlertModalProps> = ({ isOpen, onClose, file }) => {
  const { toast } = useToast();
  
  if (!file) return null;

  const handleUseExisting = () => {
    // Handle using existing file
    const browserRuntime = typeof chrome !== 'undefined' ? chrome.runtime : 
                           typeof browser !== 'undefined' ? browser.runtime : null;
                           
    if (browserRuntime && file.downloadId) {
      browserRuntime.sendMessage({
        action: 'cancelDownload',
        downloadId: file.downloadId
      }, (response) => {
        console.log('Cancel download response:', response);
        if (response && response.success) {
          toast({
            title: "Download Canceled",
            description: `Using existing file: ${file.fileName}`
          });
        } else {
          toast({
            title: "Warning",
            description: `Could not cancel download. Error: ${response?.error || 'Unknown error'}`
          });
        }
      });
    } else {
      console.log('Browser runtime not available or download ID missing');
      toast({
        title: "Action not available",
        description: "Could not communicate with the browser extension"
      });
    }
    onClose();
  };

  const handleDownloadAnyway = () => {
    // Handle downloading anyway
    const browserRuntime = typeof chrome !== 'undefined' ? chrome.runtime : 
                           typeof browser !== 'undefined' ? browser.runtime : null;
    
    if (browserRuntime && file.downloadId) {
      browserRuntime.sendMessage({
        action: 'resumeDownload',
        downloadId: file.downloadId
      }, (response) => {
        console.log('Resume download response:', response);
        if (response && response.success) {
          toast({
            title: "Download Resumed",
            description: `Downloading: ${file.fileName}`
          });
        } else {
          toast({
            title: "Warning",
            description: `Could not resume download. Error: ${response?.error || 'Unknown error'}`
          });
        }
      });
    } else {
      console.log('Browser runtime not available or download ID missing');
      toast({
        title: "Action not available",
        description: "Could not communicate with the browser extension"
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertTriangle className="h-6 w-6 text-ddas-red" />
            </div>
            <DialogTitle>Duplicate File Detected</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="bg-muted p-4 rounded-lg text-sm">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="font-medium">{file.fileName}</p>
                <p className="text-muted-foreground mt-1">
                  {file.fileSize} • Downloaded on {file.downloadDate?.toLocaleDateString()}
                </p>
              </div>
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Duplicate</span>
              </Badge>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium">This file already exists in the database:</h4>
            <div className="mt-2 text-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="text-gray-500">Downloaded by</div>
                <div>{file.downloadedBy}</div>
                
                <div className="text-gray-500">Original download</div>
                <div>{file.downloadDate ? new Date(file.downloadDate.getTime() - 7*24*60*60*1000).toLocaleDateString() : 'Unknown'}</div>
                
                <div className="text-gray-500">Checksum</div>
                <div className="font-mono text-xs">{file.checksum}</div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between gap-3 sm:gap-0">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View Original
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="default" size="sm" className="bg-ddas-green hover:bg-ddas-green/90" onClick={handleUseExisting}>
              <Check className="h-4 w-4 mr-1" />
              Use Existing
            </Button>
            <Button variant="default" size="sm" className="bg-ddas-blue hover:bg-ddas-blue/90" onClick={handleDownloadAnyway}>
              <Download className="h-4 w-4 mr-1" />
              Download Anyway
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateAlertModal;
