
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import FileHistoryTable from '@/components/FileHistoryTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_FILES } from '@/lib/mockData';
import { AlertProvider } from '@/context/AlertContext';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Downloads = () => {
  const { toast } = useToast();
  
  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your file download has started.",
      duration: 5000,
    });
  };

  return (
    <AlertProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Downloads</h1>
            <p className="text-gray-500 mt-1">
              Manage and view your downloads
            </p>
          </div>
          
          <div className="mb-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Quick Download</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button 
                    className="bg-ddas-blue hover:bg-ddas-blue/90"
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Start New Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-6">
            <FileHistoryTable files={MOCK_FILES} />
          </div>
        </main>
      </div>
    </AlertProvider>
  );
};

export default Downloads;
