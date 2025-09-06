
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FileHistoryTable from '@/components/FileHistoryTable';
import { MOCK_FILES } from '@/lib/mockData';
import { AlertProvider } from '@/context/AlertContext';

const History = () => {
  return (
    <AlertProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Download History</h1>
            <p className="text-gray-500 mt-1">
              View all your past downloads and their checksums
            </p>
          </div>
          
          <div className="mb-6">
            <FileHistoryTable files={MOCK_FILES} />
          </div>
        </main>
      </div>
    </AlertProvider>
  );
};

export default History;
