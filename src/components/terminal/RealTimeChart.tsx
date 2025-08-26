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
        <div className="bg-card border border-border p-3 font-mono text-xs">
          <p className="text-foreground font-normal">{`Round: ${label}`}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-muted-foreground font-normal">
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
            <CartesianGrid strokeDasharray="1 1" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="round" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="minted" fill="hsl(var(--foreground))" />
            <Bar dataKey="burned" fill="hsl(var(--muted-foreground))" />
          </BarChart>
        );
      
      case 'supply':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="1 1" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="round" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <defs>
              <linearGradient id="supplyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="totalSupply" 
              stroke="hsl(var(--foreground))" 
              strokeWidth={2}
              fill="url(#supplyGradient)"
              dot={false}
            />
          </AreaChart>
        );
      
      case 'holders':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="1 1" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="round" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="holdersAffected" fill="hsl(var(--muted-foreground))" />
          </BarChart>
        );
      
      default:
        return null;
    }
  };

  const getChartTitle = () => {
    switch (chartType) {
      case 'mintBurn':
        return '[CHART] MINT VS BURN PER DESTABILIZATION ROUND';
      case 'supply':
        return '[CHART] TOTAL SUPPLY OVER TIME';
      case 'holders':
        return '[CHART] HOLDERS AFFECTED EACH ROUND';
      default:
        return 'CHART';
    }
  };

  return (
    <div className="bg-card border border-border p-6 font-mono relative">
      {/* Corner plus signs */}
      <div className="absolute top-0 left-0 text-foreground text-base transform -translate-x-1/2 -translate-y-1/2">+</div>
      <div className="absolute top-0 right-0 text-foreground text-base transform translate-x-1/2 -translate-y-1/2">+</div>
      <div className="absolute bottom-0 left-0 text-foreground text-base transform -translate-x-1/2 translate-y-1/2">+</div>
      <div className="absolute bottom-0 right-0 text-foreground text-base transform translate-x-1/2 translate-y-1/2">+</div>
      
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <span className="text-foreground text-lg font-normal tracking-wide">
          {getChartTitle()}
        </span>
      </div>
      
      <div className="h-64 sm:h-80">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-muted-foreground font-mono">NO DATA AVAILABLE</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};