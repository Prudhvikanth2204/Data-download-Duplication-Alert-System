
import React from 'react';
import Navbar from '@/components/Navbar';
import UsageChart from '@/components/UsageChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_USAGE_DATA } from '@/lib/mockData';
import { AlertProvider } from '@/context/AlertContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Reports = () => {
  return (
    <AlertProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Application Reports</h1>
            <p className="text-gray-500 mt-1">
              View detailed reports and analytics
            </p>
          </div>
          
          <div className="mb-6">
            <Tabs defaultValue="usage">
              <TabsList className="mb-4">
                <TabsTrigger value="usage">Usage Reports</TabsTrigger>
                <TabsTrigger value="downloads">Download Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="usage">
                <UsageChart usageData={MOCK_USAGE_DATA} />
              </TabsContent>
              <TabsContent value="downloads">
                <Card>
                  <CardHeader>
                    <CardTitle>Download Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Details about your download patterns and history will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AlertProvider>
  );
};

export default Reports;
