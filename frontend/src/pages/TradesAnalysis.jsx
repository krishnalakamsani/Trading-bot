import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const TradesAnalysis = () => {
  const [analytics, setAnalytics] = useState(null);
  const [trades, setTrades] = useState([]);
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    optionType: 'all',
    exitReason: 'all',
    searchStrike: '',
    minPnL: '',
    maxPnL: ''
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [trades, filters]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/analytics`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data);
      setTrades(data.trades || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = trades;

    // Filter by option type
    if (filters.optionType !== 'all') {
      filtered = filtered.filter(t => t.option_type === filters.optionType);
    }

    // Filter by exit reason
    if (filters.exitReason !== 'all') {
      filtered = filtered.filter(t => t.exit_reason === filters.exitReason);
    }

    // Filter by strike
    if (filters.searchStrike) {
      filtered = filtered.filter(t => t.strike.toString().includes(filters.searchStrike));
    }

    // Filter by PnL range
    if (filters.minPnL) {
      filtered = filtered.filter(t => t.pnl >= parseFloat(filters.minPnL));
    }
    if (filters.maxPnL) {
      filtered = filtered.filter(t => t.pnl <= parseFloat(filters.maxPnL));
    }

    setFilteredTrades(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatPnL = (pnl) => {
    if (pnl === null || pnl === undefined) return '-';
    return pnl > 0 ? `+₹${pnl.toFixed(2)}` : `₹${pnl.toFixed(2)}`;
  };

  const StatCard = ({ label, value, subtext, icon: Icon, isPositive }) => (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 font-medium">{label}</p>
          <p className={`text-2xl font-bold mt-2 ${isPositive ? 'text-green-600' : isPositive === false ? 'text-red-600' : 'text-slate-900'}`}>
            {value}
          </p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        {Icon && <Icon className={`w-5 h-5 ${isPositive ? 'text-green-500' : isPositive === false ? 'text-red-500' : 'text-slate-400'}`} />}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-slate-600">Loading trade analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-slate-600">No data available</p>
      </div>
    );
  }

  const uniqueExitReasons = [...new Set(trades.map(t => t.exit_reason).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Trade Analysis</h1>
          <p className="text-slate-400">Comprehensive post-market trading performance review</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
            <TabsTrigger value="trades" className="text-white">All Trades</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total P&L"
                value={`₹${analytics.total_pnl.toFixed(2)}`}
                subtext={`${analytics.total_trades} trades`}
                icon={analytics.total_pnl >= 0 ? TrendingUp : TrendingDown}
                isPositive={analytics.total_pnl >= 0}
              />
              <StatCard
                label="Win Rate"
                value={`${analytics.win_rate.toFixed(2)}%`}
                subtext={`${analytics.winning_trades} wins, ${analytics.losing_trades} losses`}
                isPositive={analytics.win_rate >= 50}
              />
              <StatCard
                label="Profit Factor"
                value={analytics.profit_factor.toFixed(2)}
                subtext="Gross Profit / Gross Loss"
              />
              <StatCard
                label="Avg P&L Per Trade"
                value={`₹${analytics.avg_trade_pnl.toFixed(2)}`}
                isPositive={analytics.avg_trade_pnl >= 0}
              />
            </div>

            {/* Detailed Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Trade Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Best Trade</span>
                    <span className="text-green-400 font-semibold">+₹{analytics.max_profit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Worst Trade</span>
                    <span className="text-red-400 font-semibold">₹{analytics.max_loss.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Avg Win</span>
                    <span className="text-slate-200">₹{analytics.avg_win.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Avg Loss</span>
                    <span className="text-slate-200">₹{analytics.avg_loss.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Winning Trades</span>
                    <span className="text-green-400 font-semibold">{analytics.winning_trades}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Losing Trades</span>
                    <span className="text-red-400 font-semibold">{analytics.losing_trades}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Gross Profit</span>
                    <span className="text-slate-200">₹{(analytics.avg_win * analytics.winning_trades).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Gross Loss</span>
                    <span className="text-slate-200">₹{(analytics.avg_loss * analytics.losing_trades).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">By Option Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(analytics.trades_by_type).map(([optType, stats]) => (
                    <div key={optType} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="text-slate-400">{optType}</span>
                        <div className="text-xs text-slate-500">{stats.count} trades, {stats.win_rate.toFixed(1)}% win</div>
                      </div>
                      <span className={`font-semibold ${stats.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stats.pnl >= 0 ? '+' : ''}₹{stats.pnl.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trades Tab */}
          <TabsContent value="trades" className="space-y-4">
            {/* Filters */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Option Type</label>
                    <Select value={filters.optionType} onValueChange={(value) => handleFilterChange('optionType', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="all" className="text-white">All Types</SelectItem>
                        <SelectItem value="CE" className="text-white">CE (Call)</SelectItem>
                        <SelectItem value="PE" className="text-white">PE (Put)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Exit Reason</label>
                    <Select value={filters.exitReason} onValueChange={(value) => handleFilterChange('exitReason', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="all" className="text-white">All Reasons</SelectItem>
                        {uniqueExitReasons.map(reason => (
                          <SelectItem key={reason} value={reason} className="text-white">{reason}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Strike</label>
                    <Input
                      type="text"
                      placeholder="Search strike..."
                      value={filters.searchStrike}
                      onChange={(e) => handleFilterChange('searchStrike', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Min P&L (₹)</label>
                    <Input
                      type="number"
                      placeholder="Min..."
                      value={filters.minPnL}
                      onChange={(e) => handleFilterChange('minPnL', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Max P&L (₹)</label>
                    <Input
                      type="number"
                      placeholder="Max..."
                      value={filters.maxPnL}
                      onChange={(e) => handleFilterChange('maxPnL', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trades Table */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  All Trades <span className="text-sm text-slate-400 font-normal ml-2">({filteredTrades.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHead>
                      <TableRow className="border-slate-700 hover:bg-slate-700/50">
                        <TableCell className="text-slate-300 font-semibold">Time</TableCell>
                        <TableCell className="text-slate-300 font-semibold">Type</TableCell>
                        <TableCell className="text-slate-300 font-semibold">Strike</TableCell>
                        <TableCell className="text-slate-300 font-semibold">Entry Price</TableCell>
                        <TableCell className="text-slate-300 font-semibold">Exit Price</TableCell>
                        <TableCell className="text-slate-300 font-semibold">Qty</TableCell>
                        <TableCell className="text-slate-300 font-semibold">P&L</TableCell>
                        <TableCell className="text-slate-300 font-semibold">Reason</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTrades.length > 0 ? (
                        filteredTrades.map((trade, idx) => (
                          <TableRow key={idx} className="border-slate-700 hover:bg-slate-700/50">
                            <TableCell className="text-slate-300 text-sm">{formatDate(trade.entry_time)}</TableCell>
                            <TableCell>
                              <Badge variant={trade.option_type === 'CE' ? 'default' : 'secondary'}>
                                {trade.option_type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-300">{trade.strike}</TableCell>
                            <TableCell className="text-slate-300">₹{trade.entry_price.toFixed(2)}</TableCell>
                            <TableCell className="text-slate-300">₹{(trade.exit_price || 0).toFixed(2)}</TableCell>
                            <TableCell className="text-slate-300">{trade.qty}</TableCell>
                            <TableCell>
                              <span className={`font-semibold flex items-center gap-1 ${trade.pnl > 0 ? 'text-green-400' : trade.pnl < 0 ? 'text-red-400' : 'text-slate-300'}`}>
                                {trade.pnl > 0 ? <ArrowUpRight className="w-4 h-4" /> : trade.pnl < 0 ? <ArrowDownRight className="w-4 h-4" /> : null}
                                {formatPnL(trade.pnl)}
                              </span>
                            </TableCell>
                            <TableCell className="text-slate-400 text-sm">{trade.exit_reason || '-'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan="8" className="text-center text-slate-400 py-8">
                            No trades match the selected filters
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TradesAnalysis;
