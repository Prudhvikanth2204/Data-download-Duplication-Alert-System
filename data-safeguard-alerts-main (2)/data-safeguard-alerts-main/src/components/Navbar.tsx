
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Settings, User } from 'lucide-react';
import { useAlerts, Alert as AlertType } from '@/context/AlertContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export const Navbar = () => {
  const { alerts, unreadCount, markAsRead, clearAlert } = useAlerts();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const handleAlertClick = (alert: AlertType) => {
    if (!alert.read) {
      markAsRead(alert.id);
    }
  };

  return (
    <nav className="sticky top-0 bg-white border-b border-gray-200 z-10">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <div className="bg-ddas-blue text-white p-1 rounded-md mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v8"></path>
                    <path d="m16 6-4 4-4-4"></path>
                    <rect x="4" y="12" width="16" height="8" rx="2"></rect>
                  </svg>
                </div>
                <span className="font-bold text-xl text-ddas-blue">DDAS</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`${location.pathname === '/' ? 'border-ddas-blue text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </Link>
              <Link
                to="/history"
                className={`${location.pathname === '/history' ? 'border-ddas-blue text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                History
              </Link>
              <Link
                to="/reports"
                className={`${location.pathname === '/reports' ? 'border-ddas-blue text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Reports
              </Link>
              <Link
                to="/settings"
                className={`${location.pathname === '/settings' ? 'border-ddas-blue text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Settings
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-ddas-red text-white text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2 font-medium text-sm">Notifications</div>
                <DropdownMenuSeparator />
                {alerts.length === 0 ? (
                  <div className="py-6 text-center text-sm text-gray-500">
                    No notifications
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {alerts.map((alert) => (
                      <DropdownMenuItem key={alert.id} className="flex flex-col items-start p-3 cursor-default" onClick={() => handleAlertClick(alert)}>
                        <div className="flex w-full justify-between items-start">
                          <div className="font-medium text-sm flex items-center gap-2">
                            {alert.read ? (
                              alert.title
                            ) : (
                              <>
                                <div className="w-2 h-2 rounded-full bg-ddas-blue"></div>
                                {alert.title}
                              </>
                            )}
                          </div>
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              clearAlert(alert.id); 
                            }}
                            className="text-gray-400 hover:text-gray-600 text-xs">
                            Dismiss
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(alert.timestamp).toLocaleTimeString()} - {new Date(alert.timestamp).toLocaleDateString()}
                        </p>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/settings">
              <Button variant="ghost" size="icon" className="ml-2">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>

            <div className="ml-2">
              <Button variant="ghost" size="icon" className="rounded-full bg-gray-200 text-gray-700">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
