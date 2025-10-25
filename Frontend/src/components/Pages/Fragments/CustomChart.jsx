import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
        <div className="font-medium text-gray-900 mb-1">{label}</div>
        <div className="text-lg font-bold text-gray-900">
          Total: ₹{payload[0].value.toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

const TransactionChart = ({ data = [] }) => {
  // Use provided data or fallback to sample data for demo
  
  
  const inputData = data;

  const processData = (data) => {
    // First, sort all data by date, then by time (earliest first)
    const sortedData = data.sort((a, b) => {
      const dateComparison = new Date(a.date) - new Date(b.date);
      if (dateComparison !== 0) return dateComparison;
      // If dates are same, sort by time (earliest first)
      return new Date(a.time) - new Date(b.time);
    });

    // Group by date and aggregate amounts, maintaining time order
    const groupedData = sortedData.reduce((acc, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = {
          date: date,
          total: 0,
          entries: [],
          earliestTime: item.time,
          latestTime: item.time
        };
      }
      acc[date].total += item.amount;
      acc[date].entries.push(item);
      
      // Track earliest and latest times for this date
      if (new Date(item.time) < new Date(acc[date].earliestTime)) {
        acc[date].earliestTime = item.time;
      }
      if (new Date(item.time) > new Date(acc[date].latestTime)) {
        acc[date].latestTime = item.time;
      }
      
      return acc;
    }, {});

    // Convert to array and sort by date
    const processedData = Object.values(groupedData)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(item => {
        // Sort entries within each date by time (earliest first)
        item.entries.sort((a, b) => new Date(a.time) - new Date(b.time));
        
        // Format date for display
        const dateObj = new Date(item.date);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
        
        // Add ordinal suffix
        const getOrdinalSuffix = (day) => {
          if (day > 3 && day < 21) return 'th';
          switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
          }
        };

        return {
          ...item,
          displayName: `${day}${getOrdinalSuffix(day)} ${month}`,
          sortDate: new Date(item.date)
        };
      });

    return processedData;
  };

  const chartData = processData(inputData);

  return (
    <div className="w-full max-w-full h-64 sm:h-72 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ 
            top: 10, 
            right: 10, 
            left: 10, 
            bottom: 10 
          }}
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
              <stop offset="50%" stopColor="#A78BFA" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#C4B5FD" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="displayName"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#6B7280' }}
            interval={0}
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#6B7280' }}
            tickFormatter={(value) => {
              if (value >= 100000) return `${(value/100000).toFixed(0)}L`;
              if (value >= 1000) return `${(value/1000).toFixed(0)}K`;
              return value.toLocaleString();
            }}
            domain={[0, 'dataMax + 5000']}
            width={40}
          />
          
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ strokeDasharray: '3 3', stroke: '#8B5CF6' }}
          />
          
          <Area
            type="monotone"
            dataKey="total"
            stroke="#8B5CF6"
            strokeWidth={2}
            fill="url(#colorGradient)"
            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#8B5CF6', strokeWidth: 2, fill: '#FFFFFF' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;