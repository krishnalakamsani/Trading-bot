import React, { useContext } from "react";
import { AppContext } from "@/App";
import { Brain, Lock, Unlock, BadgeCheck } from "lucide-react";

const StrategyStatus = () => {
  const { strategyStatus } = useContext(AppContext);

  const mode = strategyStatus?.strategy_mode || "—";
  const waveLock = strategyStatus?.agent_state?.wave_lock;
  const lastTradeSide = strategyStatus?.agent_state?.last_trade_side;

  const adxMin = strategyStatus?.agent_params?.adx_min;
  const waveReset = strategyStatus?.agent_params?.wave_reset_macd_abs;
  const persist = strategyStatus?.agent_params?.persist_agent_state;

  return (
    <div className="terminal-card" data-testid="strategy-status">
      <div className="terminal-card-header">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-gray-900 font-[Manrope]">
            Strategy Status
          </h2>
        </div>

        <span className="text-xs text-gray-500 font-mono">{mode}</span>
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-sm p-3 border border-gray-100">
            <p className="label-text mb-1">Wave Lock</p>
            <div className="flex items-center gap-2">
              {waveLock ? (
                <Lock className="w-4 h-4 text-amber-600" />
              ) : (
                <Unlock className="w-4 h-4 text-emerald-600" />
              )}
              <p className="value-text font-mono">
                {typeof waveLock === "boolean" ? (waveLock ? "ON" : "OFF") : "—"}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-sm p-3 border border-gray-100">
            <p className="label-text mb-1">Last Trade Side</p>
            <p className="value-text font-mono">{lastTradeSide || "—"}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="label-text">ADX Min</p>
            <p className="font-mono text-gray-700">{typeof adxMin === "number" ? adxMin.toFixed(2) : "—"}</p>
          </div>
          <div>
            <p className="label-text">Wave Reset</p>
            <p className="font-mono text-gray-700">
              {typeof waveReset === "number" ? `abs(MACD) < ${waveReset.toFixed(2)}` : "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-sm text-blue-800 text-xs">
          <span className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4" />
            Persist state
          </span>
          <span className="font-mono">{typeof persist === "boolean" ? (persist ? "YES" : "NO") : "—"}</span>
        </div>
      </div>
    </div>
  );
};

export default StrategyStatus;
