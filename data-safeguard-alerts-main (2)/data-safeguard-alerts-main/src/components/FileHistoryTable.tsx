
import React from 'react';
import { FileRecord } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  FileArchive, 
  File, 
  FileCheck, 
  AlertTriangle
} from 'lucide-react';

interface FileHistoryTableProps {
  files: FileRecord[];
}

const FileHistoryTable: React.FC<FileHistoryTableProps> = ({ files }) => {
  // Function to get icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
      case 'docx':
        return <FileText className="w-4 h-4 text-ddas-blue" />;
      case 'csv':
      case 'xlsx':
        return <FileSpreadsheet className="w-4 h-4 text-ddas-green" />;
      case 'jpg':
      case 'png':
        return <FileImage className="w-4 h-4 text-ddas-teal" />;
      case 'zip':
        return <FileArchive className="w-4 h-4 text-ddas-yellow" />;
      default:
        return <File className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Download History</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">File</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Download Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.slice(0, 5).map((file) => (
                <TableRow key={file.id} className="group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.fileType)}
                      <span className="truncate max-w-[250px]">{file.fileName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{file.fileSize}</TableCell>
                  <TableCell>{file.downloadDate.toLocaleDateString()}</TableCell>
                  <TableCell>{file.downloadedBy}</TableCell>
                  <TableCell>
                    {file.isDuplicate ? (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Duplicate</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-ddas-green border-green-200 flex items-center gap-1">
                        <FileCheck className="w-3 h-3" />
                        <span>Unique</span>
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileHistoryTable;
