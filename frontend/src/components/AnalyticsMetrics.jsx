import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, Zap, Anchor, AlertTriangle } from 'lucide-react';

const AnalyticsMetrics = ({ analytics }) => {
  if (!analytics) return null;

  const metrics = [
    {
      title: 'Total PnL',
      value: `₹${analytics.total_pnl}`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: analytics.total_pnl >= 0 ? 'text-emerald-600' : 'text-red-600',
      bgColor: analytics.total_pnl >= 0 ? 'bg-emerald-50' : 'bg-red-50'
    },
    {
      title: 'Win Rate',
      value: `${analytics.win_rate}%`,
      icon: <Target className="w-5 h-5" />,
      color: analytics.win_rate >= 50 ? 'text-blue-600' : 'text-amber-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Profit Factor',
      value: analytics.profit_factor.toFixed(2),
      icon: <Zap className="w-5 h-5" />,
      color: analytics.profit_factor >= 1.5 ? 'text-emerald-600' : 'text-amber-600',
      bgColor: 'bg-emerald-50',
      subtitle: 'Total wins / Total losses'
    },
    {
      title: 'Sharpe Ratio',
      value: analytics.sharpe_ratio.toFixed(2),
      icon: <Anchor className="w-5 h-5" />,
      color: analytics.sharpe_ratio >= 1 ? 'text-purple-600' : 'text-gray-600',
      bgColor: 'bg-purple-50',
      subtitle: 'Risk-adjusted returns'
    },
    {
      title: 'Max Drawdown',
      value: `₹${Math.abs(analytics.max_drawdown)}`,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      subtitle: 'Peak-to-trough decline'
    },
    {
      title: 'Avg Trade PnL',
      value: `₹${analytics.avg_trade_pnl.toFixed(2)}`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: analytics.avg_trade_pnl >= 0 ? 'text-emerald-600' : 'text-red-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Max Consecutive Wins',
      value: analytics.max_consecutive_wins,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Max Consecutive Losses',
      value: analytics.max_consecutive_losses,
      icon: <TrendingDown className="w-5 h-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Avg Trades/Day',
      value: analytics.avg_trades_per_day.toFixed(1),
      icon: <Target className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Trading Days',
      value: analytics.trading_days,
      icon: <Target className="w-5 h-5" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric, idx) => (
        <Card key={idx} className="border-0 shadow-sm">
          <CardHeader className={`pb-2 ${metric.bgColor}`}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className={`${metric.color}`}>
                {metric.icon}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </div>
            {metric.subtitle && (
              <p className="text-xs text-gray-500 mt-1">{metric.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsMetrics;
