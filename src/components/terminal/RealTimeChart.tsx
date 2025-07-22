import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ChartData {
  round: number;
  minted: number;
  burned: number;
  totalSupply: number;
  holdersAffected: number;
  timestamp: string;
}

interface RealTimeChartProps {
  data: ChartData[];
  chartType: 'mintBurn' | 'supply' | 'holders';
}

export const RealTimeChart = ({ data, chartType }: RealTimeChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-terminal-grid p-3 font-mono text-xs">
          <p className="text-terminal-green">{`Round: ${label}`}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} style={{ color: item.color }}>
              {`${item.dataKey}: ${item.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'mintBurn':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--terminal-grid))" />
            <XAxis 
              dataKey="round" 
              tick={{ fill: 'hsl(var(--terminal-green))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--terminal-grid))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--terminal-green))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--terminal-grid))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="minted" fill="hsl(var(--terminal-cyan))" />
            <Bar dataKey="burned" fill="hsl(var(--terminal-red))" />
          </BarChart>
        );
      
      case 'supply':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--terminal-grid))" />
            <XAxis 
              dataKey="round" 
              tick={{ fill: 'hsl(var(--terminal-green))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--terminal-grid))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--terminal-green))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--terminal-grid))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="totalSupply" 
              stroke="hsl(var(--terminal-amber))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--terminal-amber))', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );
      
      case 'holders':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--terminal-grid))" />
            <XAxis 
              dataKey="round" 
              tick={{ fill: 'hsl(var(--terminal-green))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--terminal-grid))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--terminal-green))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--terminal-grid))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="holdersAffected" fill="hsl(var(--terminal-blue))" />
          </BarChart>
        );
      
      default:
        return null;
    }
  };

  const getChartTitle = () => {
    switch (chartType) {
      case 'mintBurn':
        return 'MINT VS BURN PER DESTABILIZATION ROUND';
      case 'supply':
        return 'TOTAL SUPPLY OVER TIME';
      case 'holders':
        return 'HOLDERS AFFECTED EACH ROUND';
      default:
        return 'CHART';
    }
  };

  return (
    <div className="bg-card border border-terminal-grid p-4 font-mono">
      <div className="flex items-center justify-between mb-4 border-b border-terminal-grid pb-2">
        <span className="text-terminal-green text-sm font-semibold">
          📊 {getChartTitle()}
        </span>
        <div className="flex gap-2 text-xs">
          <span className="text-terminal-cyan">REAL-TIME</span>
          <span className="text-terminal-red animate-flicker">●</span>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};