import React from 'react';

const FinancialOverviewChart = ({ 
  totalIncome = 0, 
  totalExpenses = 0, 
  totalBalance = 0,
  currency = "₹"
}) => {
  // Calculate percentages for the donut chart
  // Use absolute values for visualization, but keep original values for display
  const absBalance = Math.abs(totalBalance);
  const total = totalIncome + totalExpenses + absBalance;
  const incomePercentage = total > 0 ? (totalIncome / total) * 100 : 0;
  const expensePercentage = total > 0 ? (totalExpenses / total) * 100 : 0;
  const balancePercentage = total > 0 ? (absBalance / total) * 100 : 0;

  // Calculate stroke dash arrays for the donut segments
  const circumference = 2 * Math.PI * 45; // radius = 45
  const incomeStroke = (incomePercentage / 100) * circumference;
  const expenseStroke = (expensePercentage / 100) * circumference;
  const balanceStroke = (balancePercentage / 100) * circumference;

  // Calculate stroke dash offsets
  const incomeOffset = 0;
  const expenseOffset = -incomeStroke;
  const balanceOffset = -(incomeStroke + expenseStroke);

  const formatCurrency = (amount) => {
    if (amount < 0) {
      return `-${currency}${Math.abs(amount).toLocaleString('en-IN')}`;
    }
    return `${currency}${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="flex flex-col mt-4  items-center h-full bg-white w-full">
      {/* Donut Chart */}
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-6 sm:mb-8">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="10"
          />
          
          {/* Income segment (Green) */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#16a34a"
            strokeWidth="10"
            strokeDasharray={`${incomeStroke} ${circumference - incomeStroke}`}
            strokeDashoffset={incomeOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-in-out"
          />
          
          {/* Expenses segment (Red) */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#dc2626"
            strokeWidth="10"
            strokeDasharray={`${expenseStroke} ${circumference - expenseStroke}`}
            strokeDashoffset={expenseOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-in-out"
          />
          
          {/* Balance segment (Purple for both positive and negative) */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="10"
            strokeDasharray={`${balanceStroke} ${circumference - balanceStroke}`}
            strokeDashoffset={balanceOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-gray-500 text-xs sm:text-sm font-medium">
            {totalBalance >= 0 ? "Total Balance" : "Net Deficit"}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-gray-800">
            {formatCurrency(totalBalance)}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 px-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-600"></div>
          <span className="text-xs font-medium text-gray-700">
            {totalBalance >= 0 ? "Total Balance" : "Net Deficit"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700">Total Expenses</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700">Total Income</span>
        </div>
      </div>


    </div>
  );
};
export default FinancialOverviewChart;
