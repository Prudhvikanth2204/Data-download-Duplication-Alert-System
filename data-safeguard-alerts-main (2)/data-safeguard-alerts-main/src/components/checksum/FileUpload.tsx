
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  file: File | null;
  isCalculating: boolean;
  progress: number;
  checksum: string | null;
  error: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCalculateChecksum: () => void;
}

const FileUpload = ({
  file,
  isCalculating,
  progress,
  checksum,
  error,
  onFileChange,
  onCalculateChecksum
}: FileUploadProps) => {
  const { toast } = useToast();
  
  // Copy checksum to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "Checksum has been copied to clipboard",
        });
      },
      () => {
        toast({
          title: "Copy failed",
          description: "Failed to copy checksum to clipboard",
          variant: "destructive"
        });
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label 
          htmlFor="file-upload" 
          className="block w-full cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">
              {file ? file.name : 'Select a file to calculate checksum'}
            </span>
            <span className="text-xs text-gray-500">
              {file 
                ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
                : 'Drag and drop or click to browse'}
            </span>
          </div>
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            onChange={onFileChange} 
          />
        </label>
      </div>
      
      {file && (
        <div className="space-y-4">
          <Button 
            onClick={onCalculateChecksum} 
            disabled={isCalculating}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isCalculating ? 'Calculating...' : 'Calculate Checksum'}
          </Button>
          
          {isCalculating && (
            <div className="space-y-2">
              <div className="text-sm text-gray-500 flex justify-between">
                <span>Calculating checksum...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
          
          {checksum && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-800">Checksum Generated</h3>
                <div className="flex mt-1">
                  <p className="text-xs font-mono bg-white p-2 rounded border border-green-100 break-all flex-1">
                    {checksum}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => copyToClipboard(checksum)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error calculating checksum</h3>
                <p className="mt-1 text-xs text-red-700">
                  {error}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
