
import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatData } from '@/lib/mockData';

interface StatCardProps {
  stat: StatData;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const { title, value, change, status, isGoodWhenIncreasing } = stat;
  
  const isPositiveChange = 
    (status === 'increase' && isGoodWhenIncreasing) || 
    (status === 'decrease' && !isGoodWhenIncreasing);
  
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className={`flex items-center px-2 py-1 rounded-full text-xs ${
            isPositiveChange ? 'bg-green-50 text-ddas-green' : 'bg-red-50 text-ddas-red'
          }`}>
            {status === 'increase' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            <span>{change}%</span>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-3xl font-bold">{value}</span>
          {title === 'Storage Saved' && <span className="text-xl ml-1">GB</span>}
          {title === 'Productivity Score' && <span className="text-xl ml-1">%</span>}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
