
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertProvider } from '@/context/AlertContext';

const Settings = () => {
  return (
    <AlertProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-1">
              Manage your application preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-checksum">Auto Calculate Checksum</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically calculate checksums for downloaded files
                      </p>
                    </div>
                    <Switch id="auto-checksum" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="duplicate-alerts">Duplicate File Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts when potential duplicate files are detected
                      </p>
                    </div>
                    <Switch id="duplicate-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-monitoring">Application Usage Monitoring</Label>
                      <p className="text-sm text-muted-foreground">
                        Track and categorize application usage
                      </p>
                    </div>
                    <Switch id="app-monitoring" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AlertProvider>
  );
};

export default Settings;
