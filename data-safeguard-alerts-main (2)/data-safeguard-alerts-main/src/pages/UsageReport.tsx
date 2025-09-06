
import React from 'react';
import Navbar from '@/components/Navbar';
import UsageChart from '@/components/UsageChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_APP_USAGE, MOCK_USAGE_DATA } from '@/lib/mockData';
import { AlertProvider } from '@/context/AlertContext';

const UsageReport = () => {
  // Group usage data by category
  const groupedData = MOCK_APP_USAGE.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = [];
    }
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, typeof MOCK_APP_USAGE>);

  // Calculate total time by category
  const totalsByCategory = Object.entries(groupedData).map(([category, apps]) => {
    const totalTime = apps.reduce((sum, app) => sum + app.timeSpent, 0);
    return { category, totalTime };
  });

  return (
    <AlertProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Application Usage Report</h1>
            <p className="text-gray-500 mt-1">
              Detailed analysis of your application usage patterns
            </p>
          </div>
          
          <div className="mb-6">
            <UsageChart usageData={MOCK_USAGE_DATA} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Productive Apps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Productive Apps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {groupedData['productive']?.map(app => (
                    <li key={app.appName} className="flex justify-between">
                      <span>{app.appName}</span>
                      <span className="font-mono">{Math.floor(app.timeSpent / 60)}h {app.timeSpent % 60}m</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Neutral Apps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-teal-600">Neutral Apps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {groupedData['neutral']?.map(app => (
                    <li key={app.appName} className="flex justify-between">
                      <span>{app.appName}</span>
                      <span className="font-mono">{Math.floor(app.timeSpent / 60)}h {app.timeSpent % 60}m</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Non-Productive Apps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Non-Productive Apps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {groupedData['non-productive']?.map(app => (
                    <li key={app.appName} className="flex justify-between">
                      <span>{app.appName}</span>
                      <span className="font-mono">{Math.floor(app.timeSpent / 60)}h {app.timeSpent % 60}m</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AlertProvider>
  );
};

export default UsageReport;
