
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAlerts } from '@/context/AlertContext';
import DuplicateAlertModal from '@/components/DuplicateAlertModal';
import { FileRecord } from '@/lib/mockData';
import { AlertTriangle } from 'lucide-react';

const DuplicateNotification: React.FC = () => {
  const { toast } = useToast();
  const { addAlert } = useAlerts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [duplicateFile, setDuplicateFile] = useState<FileRecord | null>(null);

  useEffect(() => {
    console.log('DuplicateNotification component mounted');
    
    // Function to handle duplicate detection messages
    const handleDuplicateDetection = (file: any) => {
      console.log('Processing duplicate detection for:', file);
      
      const fileRecord: FileRecord = {
        id: file.fileName || String(Date.now()),
        fileName: file.fileName || 'Unknown file',
        fileSize: file.fileSize || '1.2 MB',
        fileType: file.fileName ? file.fileName.split('.').pop() || 'unknown' : 'unknown',
        downloadDate: new Date(),
        downloadedBy: 'Current User',
        checksum: file.checksum || file.originalChecksum || '',
        isDuplicate: true,
        downloadId: file.downloadId // Store the download ID
      };
      
      // Toast notification
      toast({
        title: "Duplicate File Detected",
        description: `"${file.fileName}" already exists`,
        variant: "destructive"
      });
      
      // Add to alerts
      addAlert(
        'duplicate', 
        'Duplicate File Detected', 
        `The file "${file.fileName}" is already in the database.`
      );
      
      // Show modal
      setDuplicateFile(fileRecord);
      setIsModalOpen(true);
    };

    // Set up listeners for browser extension messages
    const setupMessageListeners = () => {
      // Safer chrome/browser runtime check
      const browserRuntime = typeof chrome !== 'undefined' ? chrome.runtime : 
                            typeof browser !== 'undefined' ? browser.runtime : null;

      if (browserRuntime) {
        console.log('Browser runtime detected, setting up message listener');
        
        const messageListener = (message: any, sender: any, sendResponse: Function) => {
          console.log('Message received:', message);
          
          if (message.action === 'duplicateDetected') {
            console.log('Duplicate detected:', message.file);
            handleDuplicateDetection(message.file);
            // Send response to prevent "Could not establish connection" error
            if (sendResponse) sendResponse({ received: true });
          }
          return true; // Keep the message channel open for async responses
        };

        // Add listener and store the function reference for cleanup
        browserRuntime.onMessage.addListener(messageListener);

        // Cleanup listener
        return () => {
          console.log('Removing message listener');
          browserRuntime.onMessage.removeListener(messageListener);
        };
      }
      
      return undefined;
    };

    // Set up extension message listeners
    const cleanup = setupMessageListeners();

    // Fallback simulation for web app demo
    const simulateDuplicateDetection = (e: KeyboardEvent) => {
      if (e.key === 'd' && e.ctrlKey) {
        console.log('Simulating duplicate detection with Ctrl+D');
        // Simulate a duplicate detection with more detailed file information
        handleDuplicateDetection({
          fileName: 'simulated_duplicate_file.pdf',
          fileSize: '2.5 MB',
          checksum: '8a7b5c3d2e1f0a9b8c7d6e5f4a3b2c1d',
          filePath: '/downloads/personal/',
          downloadId: 12345 // Simulated download ID
        });
      }
    };

    window.addEventListener('keydown', simulateDuplicateDetection);
    
    return () => {
      if (cleanup) cleanup();
      window.removeEventListener('keydown', simulateDuplicateDetection);
    };
  }, [toast, addAlert]);

  return (
    <DuplicateAlertModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      file={duplicateFile}
    />
  );
};

export default DuplicateNotification;
