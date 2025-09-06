
import React from 'react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AppUsage, transformAppUsageToChartFormat, UsageData } from '@/lib/mockData';

export interface UsageChartProps {
  usageData: AppUsage[] | UsageData[];
}

const UsageChart: React.FC<UsageChartProps> = ({ usageData }) => {
  // Check if the data is AppUsage or UsageData
  const transformedData: UsageData[] = Array.isArray(usageData) 
    ? (usageData.length > 0 && 'appName' in usageData[0] 
      ? transformAppUsageToChartFormat(usageData as AppUsage[])
      : usageData as UsageData[])
    : [];

  const chartData = [...transformedData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const BarChart = (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis 
          tickFormatter={(value) => `${value}m`}
          label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip formatter={(value) => `${value} min`} />
        <Legend />
        <Bar dataKey="productive" name="Productive" fill="#059669" radius={[4, 4, 0, 0]} />
        <Bar dataKey="neutral" name="Neutral" fill="#0D9488" radius={[4, 4, 0, 0]} />
        <Bar dataKey="nonproductive" name="Non-productive" fill="#DC2626" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Application Usage Over Time</h3>
      {BarChart}
    </div>
  );
};

export default UsageChart;
