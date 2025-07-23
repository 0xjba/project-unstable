import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

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
          <p className="text-foreground">{`Round: ${label}`}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-muted-foreground">
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
            <CartesianGrid strokeDasharray="1 1" stroke="hsl(var(--terminal-grid))" />
            <XAxis 
              dataKey="round" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--terminal-grid))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--terminal-grid))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="minted" fill="hsl(var(--terminal-bright))" />
            <Bar dataKey="burned" fill="hsl(var(--terminal-dim))" />
          </BarChart>
        );
      
      case 'supply':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="1 1" stroke="hsl(var(--terminal-grid))" />
            <XAxis 
              dataKey="round" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--terminal-grid))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--terminal-grid))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <defs>
              <linearGradient id="supplyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="totalSupply" 
              stroke="hsl(var(--foreground))" 
              strokeWidth={1}
              fill="url(#supplyGradient)"
              dot={false}
            />
          </AreaChart>
        );
      
      case 'holders':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="1 1" stroke="hsl(var(--terminal-grid))" />
            <XAxis 
              dataKey="round" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--terminal-grid))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--terminal-grid))' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="holdersAffected" fill="hsl(var(--terminal-dim))" />
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
        <span className="text-foreground text-sm font-semibold">
          [CHART] {getChartTitle()}
        </span>
        <div className="flex gap-2 text-xs">
          <span className="text-muted-foreground">REAL-TIME</span>
          <span className="text-terminal-bright">●</span>
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