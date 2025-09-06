
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type AlertType = 'duplicate' | 'usage' | 'system' | 'security';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (type: AlertType, title: string, message: string) => void;
  markAsRead: (id: string) => void;
  clearAlert: (id: string) => void;
  clearAllAlerts: () => void;
  unreadCount: number;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'duplicate',
      title: 'Duplicate Detected',
      message: 'The file "financial_report_2023.xlsx" is already in the database.',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      type: 'usage',
      title: 'High Non-Productive Usage',
      message: 'User has spent over 2 hours on non-productive applications today.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false
    },
    {
      id: '3',
      type: 'system',
      title: 'System Update',
      message: 'Database has been updated with 50 new file signatures.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true
    }
  ]);

  const addAlert = (type: AlertType, title: string, message: string) => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false
    };
    setAlerts([newAlert, ...alerts]);
  };

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const clearAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <AlertContext.Provider value={{ 
      alerts, 
      addAlert, 
      markAsRead, 
      clearAlert, 
      clearAllAlerts,
      unreadCount
    }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};
