
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MOCK_FILES } from '@/lib/mockData';
import { FileText, FileCheck, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AlertProvider } from '@/context/AlertContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const DownloadDatabase = () => {
  return (
    <AlertProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Download Database</h1>
            <p className="text-gray-500 mt-1">
              Search and manage your download records
            </p>
          </div>
          
          <Card className="shadow-sm mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Search Database</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input placeholder="Search by filename, checksum, or date..." className="flex-grow" />
                <Button>Search</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Database Records</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>Checksum</TableHead>
                      <TableHead>Download Date</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_FILES.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">{file.fileName}</TableCell>
                        <TableCell className="font-mono text-xs">{file.checksum || 'N/A'}</TableCell>
                        <TableCell>{file.downloadDate.toLocaleDateString()}</TableCell>
                        <TableCell>{file.fileSize}</TableCell>
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
        </main>
      </div>
    </AlertProvider>
  );
};

export default DownloadDatabase;
