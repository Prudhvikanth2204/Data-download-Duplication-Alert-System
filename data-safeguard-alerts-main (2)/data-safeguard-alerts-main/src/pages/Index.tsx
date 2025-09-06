
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import UsageChart from '@/components/UsageChart';
import FileHistoryTable from '@/components/FileHistoryTable';
import DuplicateAlertModal from '@/components/DuplicateAlertModal';
import DuplicateNotification from '@/components/DuplicateNotification';
import AlertBanner from '@/components/AlertBanner';
import ChecksumCalculator from '@/components/ChecksumCalculator';
import { AlertProvider } from '@/context/AlertContext';
import { MOCK_FILES, MOCK_APP_USAGE, MOCK_USAGE_DATA, MOCK_STATS } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, AlertTriangle, Clock, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const { toast } = useToast();
  const [showAlertBanner, setShowAlertBanner] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleDownloadAttempt = () => {
    const isDuplicate = Math.random() > 0.5;
    
    if (isDuplicate) {
      const randomFileIndex = Math.floor(Math.random() * MOCK_FILES.length);
      const file = { ...MOCK_FILES[randomFileIndex], isDuplicate: true };
      
      setIsModalOpen(true);
    } else {
      toast({
        title: "Download Started",
        description: "Your file download has started.",
        duration: 5000,
      });
    }
  };

  // Convert MOCK_STATS from type Stat[] to the required StatData[] format
  const statDataArray = MOCK_STATS.map(stat => ({
    title: stat.label,
    value: stat.value,
    change: stat.delta.replace('%', ''),
    status: stat.deltaType || 'increase',
    isGoodWhenIncreasing: stat.deltaType === 'increase'
  }));

  return (
    <AlertProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <DuplicateNotification />
        
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {showAlertBanner && (
            <AlertBanner 
              message="High non-productive app usage detected. 2h 15m spent on non-productive applications today."
              onDismiss={() => setShowAlertBanner(false)}
            />
          )}
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">DDAS Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Monitor downloads, prevent duplicates, and track application usage
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statDataArray.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
          
          <div className="mb-6">
            <ChecksumCalculator />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <FileHistoryTable files={MOCK_FILES} />
            </div>
            
            <div>
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start bg-ddas-blue hover:bg-ddas-blue/90"
                      onClick={handleDownloadAttempt}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Simulate File Download
                    </Button>
                    
                    <Link to="/download-database" className="w-full">
                      <Button 
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Database className="mr-2 h-4 w-4" />
                        View Download Database
                      </Button>
                    </Link>
                    
                    <Link to="/history" className="w-full">
                      <Button 
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        View All Alerts
                      </Button>
                    </Link>
                    
                    <Link to="/usage-report" className="w-full">
                      <Button 
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Application Usage Report
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mb-6">
            <UsageChart usageData={MOCK_USAGE_DATA} />
          </div>
        </main>
        
        <DuplicateAlertModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          file={MOCK_FILES.find(file => file.isDuplicate) || null}
        />
        
        <Toaster />
      </div>
    </AlertProvider>
  );
};

export default Index;
