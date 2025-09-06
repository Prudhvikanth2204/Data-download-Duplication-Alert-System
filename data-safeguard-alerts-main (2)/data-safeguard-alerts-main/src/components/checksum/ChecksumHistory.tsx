
import React from 'react';
import { Database, Copy, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { deleteChecksum } from '@/utils/checksumService';

interface ChecksumHistoryProps {
  storedChecksums: Record<string, { checksum: string; timestamp: number; fileName: string }>;
  onRefresh: () => void;
  usePostgres: boolean;
}

const ChecksumHistory = ({
  storedChecksums,
  onRefresh,
  usePostgres
}: ChecksumHistoryProps) => {
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

  // Delete a checksum record
  const handleDelete = async (id: string) => {
    try {
      await deleteChecksum(id);
      toast({
        title: "Checksum deleted",
        description: "The checksum record has been removed from PostgreSQL",
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete checksum record",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          {usePostgres ? "PostgreSQL Database" : "Stored Checksums"}
        </h3>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <Database className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>
      
      <div className="border rounded-md">
        {Object.keys(storedChecksums).length > 0 ? (
          <div className="divide-y">
            {Object.entries(storedChecksums).map(([id, data]) => (
              <div key={id} className="p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm truncate">{data.fileName}</p>
                    <p className="text-xs text-gray-500 break-all max-w-[500px] truncate">
                      {id}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(data.checksum)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500"
                      onClick={() => handleDelete(id)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs font-mono bg-gray-50 p-2 mt-1 rounded border border-gray-200 break-all">
                  {data.checksum}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(data.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Database className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No checksums stored yet</p>
            <p className="text-xs text-gray-400 mt-1">
              {usePostgres 
                ? "Calculate checksums or download files to populate the PostgreSQL database" 
                : "Calculate checksums or scan directories to populate this list"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChecksumHistory;
