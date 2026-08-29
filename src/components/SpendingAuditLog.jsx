import React from 'react';
import PixelIcon from './PixelIcon';

export const SpendingAuditLog = ({ spendingLogs = [] }) => {
  return (
    <div className="bg-slate-900 border-4 border-slate-700 p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <PixelIcon name="chart" size={24} className="text-cyan-400" />
          <h3 className="text-xl font-bold font-mono tracking-wider text-cyan-400">
            ON-CHAIN SPENDING LOG
          </h3>
        </div>
        <span className="text-xs bg-cyan-400/20 text-cyan-300 font-mono px-2 py-1 border border-cyan-400/40">
          PUBLIC AUDIT
        </span>
      </div>

      <p className="text-xs text-slate-400 font-mono mb-4 leading-relaxed">
        Every XLM withdrawal from project escrow is permanently logged on the Stellar ledger for complete financial transparency.
      </p>

      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {spendingLogs.length === 0 ? (
          <div className="text-center py-6 text-slate-500 font-mono text-xs">
            No expenditures logged yet.
          </div>
        ) : (
          spendingLogs.map((log) => (
            <div
              key={log.id}
              className="border border-slate-700 bg-slate-800/40 p-3 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-700/60 px-1.5 py-0.5">
                  {log.category.toUpperCase()}
                </span>
                <span className="text-sm font-mono font-bold text-yellow-400">
                  -{log.amount} XLM
                </span>
              </div>
              <p className="text-xs text-slate-200 font-mono">{log.description}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-700/40">
                <span className="truncate max-w-[200px]" title={log.recipient}>
                  To: {log.recipient}
                </span>
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SpendingAuditLog;
