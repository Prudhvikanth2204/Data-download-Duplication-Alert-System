
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { calculateChecksum, getAllChecksums, saveChecksum, ChecksumRecord, scanDirectory } from '@/utils/checksumService';
import { useToast } from '@/hooks/use-toast';
import { uuid } from '@/lib/utils';

// Import our components
import StorageToggle from './checksum/StorageToggle';
import FileUpload from './checksum/FileUpload';
import DirectoryScan from './checksum/DirectoryScan';
import ChecksumHistory from './checksum/ChecksumHistory';
import DataSourceToggle from './checksum/DataSourceToggle';

// Check if browser extension API is available
const isBrowserExtension = (): boolean => {
  return typeof browser !== 'undefined' || typeof chrome !== 'undefined';
};

interface StoredChecksum {
  checksum: string;
  timestamp: number;
  fileName: string;
}

const ChecksumCalculator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [checksum, setChecksum] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storedChecksums, setStoredChecksums] = useState<Record<string, StoredChecksum>>({});
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [usePostgres, setUsePostgres] = useState(true); // Default to PostgreSQL
  const { toast } = useToast();

  // Load saved checksums on component mount
  useEffect(() => {
    loadStoredChecksums();
  }, [usePostgres]);

  const loadStoredChecksums = async () => {
    try {
      const checksums = await getAllChecksums();
      console.log('Loaded checksums from API:', checksums);
      
      // Transform the array to a record
      const checksumRecord: Record<string, StoredChecksum> = {};
      
      if (Array.isArray(checksums)) {
        checksums.forEach(item => {
          checksumRecord[item.id] = {
            checksum: item.checksum,
            timestamp: typeof item.timestamp === 'number' ? item.timestamp : parseInt(item.timestamp),
            fileName: item.fileName
          };
        });
      }
      
      setStoredChecksums(checksumRecord);
    } catch (error) {
      console.error('Error loading checksums:', error);
      toast({
        title: "Error loading checksums",
        description: "Could not load saved checksums",
        variant: "destructive",
      });
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setChecksum(null);
      setError(null);
      setProgress(0);
    }
  };

  // Calculate checksum for the selected file
  const handleCalculateChecksum = async () => {
    if (!file) return;
    
    try {
      setIsCalculating(true);
      setProgress(0);
      setError(null);
      
      // Create a progress tracking function
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 - prev) * 0.05;
          return newProgress > 99 ? 99 : newProgress;
        });
      }, 200);
      
      // Calculate the checksum
      const result = await calculateChecksum(file);
      
      // Clear interval and set final values
      clearInterval(progressInterval);
      setProgress(100);
      setChecksum(result);
      
      // Save to storage (either extension storage or PostgreSQL via API)
      const record: ChecksumRecord = {
        id: uuid(),
        fileName: file.name,
        checksum: result,
        timestamp: Date.now()
      };
      
      await saveChecksum(record);
      
      toast({
        title: "Checksum saved",
        description: usePostgres 
          ? "The checksum has been saved to the PostgreSQL database" 
          : "The checksum has been saved to the extension storage",
      });
      
      // Refresh stored checksums
      await loadStoredChecksums();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle directory selection and scanning
  const handleDirectorySelect = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        setIsScanning(true);
        setScanProgress(0);
        
        const directoryHandle = await window.showDirectoryPicker();
        
        // Start scanning progress simulation
        const scanInterval = setInterval(() => {
          setScanProgress(prev => {
            const newProgress = prev + 1;
            return newProgress > 99 ? 99 : newProgress;
          });
        }, 100);
        
        // Perform the actual scan
        const results = await scanDirectory(directoryHandle);
        
        clearInterval(scanInterval);
        setScanProgress(100);
        
        toast({
          title: "Directory scan complete",
          description: `Processed ${results.length} files and saved their checksums`,
        });
        
        // Refresh stored checksums
        await loadStoredChecksums();
      } else {
        toast({
          title: "Feature not supported",
          description: "Directory selection is not supported in this browser",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Directory scanning error:', err);
      toast({
        title: "Scanning error",
        description: err instanceof Error ? err.message : 'An error occurred while scanning',
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Handle data source change
  const handleDataSourceChange = (isMockData: boolean) => {
    toast({
      title: `Using ${isMockData ? 'mock data' : 'real API data'}`,
      description: isMockData 
        ? "Mock data is now being used for demonstration" 
        : "Real API data is now being used"
    });
    
    // Refresh the checksums
    loadStoredChecksums();
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">File Checksum Calculator</CardTitle>
        <CardDescription>
          Calculate SHA-256 checksum for files of any size, stored in PostgreSQL
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataSourceToggle onChange={handleDataSourceChange} />
        
        <StorageToggle 
          usePostgres={usePostgres} 
          onToggleChange={setUsePostgres} 
        />
        
        <Tabs defaultValue="calculate">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="calculate">Calculate</TabsTrigger>
            <TabsTrigger value="scan">Scan Directory</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculate">
            <FileUpload 
              file={file}
              isCalculating={isCalculating}
              progress={progress}
              checksum={checksum}
              error={error}
              onFileChange={handleFileChange}
              onCalculateChecksum={handleCalculateChecksum}
            />
          </TabsContent>
          
          <TabsContent value="scan">
            <DirectoryScan 
              isScanning={isScanning}
              scanProgress={scanProgress}
              onDirectorySelect={handleDirectorySelect}
              usePostgres={usePostgres}
            />
          </TabsContent>
          
          <TabsContent value="history">
            <ChecksumHistory 
              storedChecksums={storedChecksums}
              onRefresh={loadStoredChecksums}
              usePostgres={usePostgres}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChecksumCalculator;
