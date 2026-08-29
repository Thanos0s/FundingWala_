import React from 'react';
import { PixelIcon } from './PixelIcon';

export const SpendingAuditLog = ({ spendingLogs = [] }) => {
  return (
    <div className="pixel-box p-6 md:p-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#D4E751] border-3 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] flex-shrink-0">
            <PixelIcon name="chart" className="w-7 h-7 text-black" />
          </div>
          <div>
            <h3 className="font-pixel-heading text-base md:text-lg font-bold text-black uppercase tracking-tight">
              ON-CHAIN SPENDING LOG
            </h3>
            <p className="font-pixel-body text-xs text-gray-600 font-bold mt-1">
              PUBLIC TREASURY AUDIT TRAIL
            </p>
          </div>
        </div>
        <span className="font-pixel-body text-xs bg-black text-[#D4E751] font-bold px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          STELLAR LEDGER
        </span>
      </div>

      {/* Intro Description */}
      <p className="font-mono text-xs md:text-sm text-gray-700 font-medium mb-6 leading-relaxed bg-yellow-50 border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_#000]">
        Every XLM withdrawal from project escrow is permanently recorded on the Stellar blockchain, giving backers complete transparency over how funds are spent.
      </p>

      {/* Spending Items List */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
        {spendingLogs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-black font-mono text-sm text-gray-600 font-bold">
            No expenditures logged yet.
          </div>
        ) : (
          spendingLogs.map((log) => (
            <div
              key={log.id}
              className="border-3 border-black bg-white p-4 md:p-5 shadow-[4px_4px_0px_0px_#000] space-y-3"
            >
              {/* Category & Amount Row */}
              <div className="flex items-center justify-between gap-2 border-b-2 border-black pb-2.5">
                <span className="font-pixel-body text-xs font-bold text-black bg-[#D4E751] border-2 border-black px-2.5 py-1 shadow-[1px_1px_0px_0px_#000]">
                  {log.category.toUpperCase()}
                </span>
                <span className="font-pixel-heading text-sm md:text-base font-extrabold text-black">
                  -{log.amount} XLM
                </span>
              </div>

              {/* Description */}
              <p className="font-mono text-sm md:text-base text-gray-900 font-bold leading-normal">
                {log.description}
              </p>

              {/* Recipient & Timestamp Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-gray-700 bg-gray-100 border border-black p-2.5">
                <span className="font-semibold">
                  <strong className="text-black">Recipient:</strong> {log.recipient}
                </span>
                <span className="font-semibold text-gray-600">
                  {log.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SpendingAuditLog;
