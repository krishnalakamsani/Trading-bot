# SuperTrend Trading Bot 🤖

An automated options trading bot for NSE indices (NIFTY, BANKNIFTY, SENSEX, FINNIFTY) using the SuperTrend indicator and Dhan Trading API. Paper and live trading modes with real-time dashboard.

---

## 🚀 Quick Features

✅ **SuperTrend Strategy** - Period 7, Multiplier 4 on 5-second candles  
✅ **Multiple Indices** - NIFTY, BANKNIFTY, SENSEX, FINNIFTY support  
✅ **Risk Management** - Daily loss limits, per-trade loss caps, position sizing  
✅ **Trailing Stop Loss** - Dynamic SL that follows profits  
✅ **Order Fill Verification** - Confirms orders are actually filled  
✅ **Trading Hours Protection** - No entries before 9:25 AM or after 3:10 PM  
✅ **Paper & Live Modes** - Test safely before going live  
✅ **Trade Analysis** - Post-market analytics with filters and statistics  
✅ **Real-time Dashboard** - Live updates via WebSocket

---

## 📋 System Requirements

- **OS**: Linux/Mac/Windows
- **Python**: 3.9+
- **Node.js**: 16+ (for frontend)
- **Docker**: (optional, for containerized deployment)

---

## 🏗️ Architecture

```
Trading-Bot/
├── backend/                 # Python FastAPI server
│   ├── dhan_api.py         # Dhan broker API wrapper
│   ├── trading_bot.py      # Core trading engine
│   ├── indicators.py       # SuperTrend indicator
│   ├── database.py         # SQLite operations
│   ├── config.py           # Configuration & state
│   └── server.py           # FastAPI routes
├── frontend/                # React dashboard
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Main trading UI
│   │   │   └── TradesAnalysis.jsx  # Trade statistics
│   │   ├── components/
│   │   │   ├── ControlsPanel.jsx   # Start/Stop/Mode
│   │   │   ├── SettingsPanel.jsx   # Configuration
│   │   │   └── TradesTable.jsx     # Trade history
│   │   └── App.js
│   └── package.json
└── README.md
```

---

## 🔧 Installation & Setup

### Backend Setup

```bash
# Navigate to project root
cd Trading-bot

# Install Python dependencies
pip install -r backend/requirements.txt

# Create logs directory
mkdir -p backend/logs
mkdir -p backend/data
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_BACKEND_URL=http://localhost:8000" > .env
```

---

## 🚢 Deployment

### Option 1: Local Development (Recommended for Testing)

**Terminal 1 - Backend**:
```bash
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm start
```

Access the app at: `http://localhost:3000`

### Option 2: Docker Deployment (Production)

**Requirements**:
- Docker & Docker Compose installed

**Steps**:

1. **Create .env file**:
```bash
cp .env.example .env
```

2. **Update .env** with your IP/domain:
```env
REACT_APP_BACKEND_URL=http://your-server-ip:8000
BACKEND_PORT=8000
```

3. **Start containers**:
```bash
docker-compose up -d --build
```

4. **Verify deployment**:
```bash
docker-compose ps
docker-compose logs -f backend
```

**Access**:
- Frontend: `http://your-server-ip`
- API: `http://your-server-ip:8000/api`

**Useful Docker Commands**:
```bash
docker-compose down          # Stop all containers
docker-compose logs -f       # View logs
docker-compose restart       # Restart containers
docker cp <container>:/app/data/trading.db ./backup.db  # Backup DB
```

### Option 3: Systemd Service (Linux Production)

Create `/etc/systemd/system/trading-bot.service`:
```ini
[Unit]
Description=Trading Bot
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/Trading-bot/backend
ExecStart=/usr/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl start trading-bot
sudo systemctl enable trading-bot
```

---

## 📖 How to Use

### 1. Initial Setup

**Step 1**: Open dashboard at `http://localhost:3000`

**Step 2**: Go to **Settings** → **Credentials**
- Enter Dhan API Token
- Enter Dhan Client ID
- Click **Save**

**Step 3**: Go to **Settings** → **Risk** to configure:
- **Initial Stop Loss**: Points (e.g., 50)
- **Max Loss Per Trade**: ₹ (e.g., 500, 0=disabled)
- **Trail Start Profit**: Points to start trailing (e.g., 10)
- **Trail Step**: How much to move SL per step (e.g., 5)
- **Target Points**: Exit at profit (e.g., 100, 0=disabled)
- **Risk Per Trade**: Rupees to risk (e.g., 1000, 0=disabled)
- **Daily Max Loss**: ₹ (e.g., 2000)
- **Max Trades/Day**: Limit entries (e.g., 5)

### 2. Start Trading

**Click "Start Bot"** button to begin:
- Select **Paper** mode first (highly recommended!)
- Monitor **Top Bar** status indicators
- Watch **Market Data** section for SuperTrend signals
- Monitor **Position Panel** for open positions

### 3. Monitor Trading

**Dashboard shows**:
- Current index LTP (NIFTY/BANKNIFTY/etc)
- SuperTrend signal (GREEN=Buy CE, RED=Buy PE)
- Current open position (strike, entry, P&L)
- Daily summary (trades, P&L, max drawdown)
- Recent trade logs

### 4. Manual Exits

**Click "Square Off"** button to close position:
- Closes at current market price
- Saves trade with actual exit
- No confirmation dialog

### 5. View Trade Analysis

**Click "Analysis"** button in top bar:
- **Overview**: Statistics, Win Rate, Profit Factor
- **All Trades Tab**: Filter by type, exit reason, strike, P&L range

---

## 📊 Features Explained

### SuperTrend Strategy
- **Indicator**: SuperTrend(Period=7, Multiplier=4)
- **Timeframe**: 5-second candles
- **Entry**: 
  - GREEN = Buy CE (Call)
  - RED = Buy PE (Put)
- **Strike**: ATM (spot rounded to nearest 50)
- **Exit Conditions** (priority order):
  1. Max Loss Per Trade exceeded ⚠️
  2. Target Points hit ✓
  3. Trailing Stop Loss hit
  4. Daily Max Loss triggered

### Risk Management

**Daily Max Loss**: 
- Once triggered, no new entries allowed
- Existing positions can still exit

**Max Loss Per Trade**: 
- Individual trade risk limit
- Auto-closes if exceeded

**Risk Per Trade**: 
- Auto-calculates position size
- Formula: `Qty = RiskAmount / (SL_Points × Lot_Size)`

**Trailing Stop Loss**:
- Activates after `Trail Start Profit`
- Moves up by `Trail Step` on each high
- Locks in profits

### Trading Hours Protection
- **No entries before**: 9:25 AM
- **No entries after**: 3:10 PM
- Prevents overnight position risk
- Existing positions can exit anytime

### Order Fill Verification
- Every order verified filled
- Checks status every 0.5 seconds
- Waits max 15 seconds
- Ensures accuracy with broker

---

## ⚙️ Configuration Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| Initial SL | 50 | Points below entry |
| Max Loss/Trade | 0 | ₹ per trade (0=disabled) |
| Trail Start | 10 | Profit points to start trailing |
| Trail Step | 5 | SL increment points |
| Target Points | 0 | Profit exit (0=disabled) |
| Risk/Trade | 0 | ₹ for auto-sizing (0=disabled) |
| Daily Max Loss | 2000 | ₹ daily limit |
| Max Trades/Day | 5 | Entry limit |

---

## 🐛 Troubleshooting

**Bot won't connect to Dhan**:
- Check credentials in Settings
- Verify token hasn't expired
- Check internet connection

**Orders not placed**:
- Are you in Paper or Live mode?
- Is bot running (shows "Running")?
- Is it between 9:25 AM - 3:10 PM?
- Check daily max loss triggered?

**Positions not closing**:
- Check exit conditions being met
- Use "Square Off" to force close
- Check bot still running

**Analytics shows no trades**:
- Only completed trades appear
- Check a trade is actually exited

**Frontend won't load**:
- Backend must be running on port 8000
- Check `REACT_APP_BACKEND_URL` environment variable
- Check firewall not blocking port 8000

---

## 📝 Trading Mode Differences

| Feature | Paper Mode | Live Mode |
|---------|-----------|-----------|
| Orders | Simulated | Real orders |
| Money | Play money | Actual rupees |
| Risk | None | Real losses possible |

**Always test in Paper mode first!**

---

## 🔐 Security & Safety

- **Local Credentials**: Stored in SQLite on your machine
- **No Cloud**: Everything runs locally
- **Order Validation**: Every order verified filled
- **Circuit Breakers**: Daily loss limits prevent catastrophic losses
- **HTTPS**: Use HTTPS in production

---

## 📈 Post-Deployment Checklist

- [ ] Test in Paper mode for 1-2 days
- [ ] Review trades daily in Analytics page
- [ ] Fine-tune SL/Target based on results
- [ ] Monitor logs for errors
- [ ] Start Live with 1 lot
- [ ] Increase gradually based on confidence

---

## 📄 Logs & Debugging

```bash
# Backend logs
backend/logs/bot.log

# Docker logs
docker-compose logs -f backend

# Real-time logs
docker-compose logs --follow
```

Each log entry includes:
- Timestamp
- Component tag [ORDER], [SIGNAL], [ENTRY], etc.
- Detailed message for debugging

---

## ⚠️ Disclaimer

**This bot makes REAL trades with REAL money in Live mode.**

- Past performance ≠ future results
- Options trading is RISKY - you can lose everything
- **Start with Paper Trading only**
- Use only capital you can afford to lose
- SuperTrend is NOT a guaranteed winning strategy
- Market gaps can cause losses beyond SL
- Monitor the bot regularly

**Use entirely at your own risk.**

---

## 📞 Quick Start Summary

```bash
# 1. Install
pip install -r backend/requirements.txt
cd frontend && npm install

# 2. Start Backend
cd backend && python -m uvicorn server:app --reload

# 3. Start Frontend
cd frontend && npm start

# 4. Open http://localhost:3000

# 5. Settings → Add Dhan credentials

# 6. Settings → Configure Risk

# 7. Click "Start Bot" → Select "Paper"

# 8. Monitor trades

# 9. Check Analytics page for statistics
```

---

**Last Updated**: January 2026  
**Version**: 1.0  
**Status**: Production Ready ✅
