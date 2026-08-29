import React from 'react';
import { PixelIcon } from './PixelIcon';

export const SpendingAuditLog = ({ spendingLogs = [] }) => {
  return (
    <div className="pixel-box p-6 md:p-8 bg-white font-pixel-body">
      <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#D4E751] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
            <PixelIcon name="chart" className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="font-pixel-heading text-sm md:text-base font-bold text-black uppercase">
              ON-CHAIN SPENDING LOG
            </h3>
            <p className="text-[10px] text-gray-600 font-bold mt-0.5">PUBLIC TREASURY AUDIT</p>
          </div>
        </div>
        <span className="text-[10px] bg-black text-[#D4E751] font-bold px-2 py-1 border border-black">
          STELLAR LEDGER
        </span>
      </div>

      <p className="text-xs text-gray-700 font-bold mb-5 leading-relaxed">
        Every XLM withdrawal from project escrow is permanently logged on the Stellar blockchain for complete financial transparency.
      </p>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {spendingLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-bold text-xs">
            No expenditures logged yet.
          </div>
        ) : (
          spendingLogs.map((log) => (
            <div
              key={log.id}
              className="border-3 border-black bg-white p-3.5 flex flex-col gap-2 shadow-[3px_3px_0px_0px_#000]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-black bg-[#D4E751] border-2 border-black px-2 py-0.5">
                  {log.category.toUpperCase()}
                </span>
                <span className="font-pixel-heading text-xs font-bold text-black">
                  -{log.amount} XLM
                </span>
              </div>
              <p className="text-xs text-gray-800 font-bold">{log.description}</p>
              <div className="flex items-center justify-between text-[11px] text-gray-600 font-mono pt-2 border-t border-gray-200">
                <span className="truncate max-w-[240px]" title={log.recipient}>
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
