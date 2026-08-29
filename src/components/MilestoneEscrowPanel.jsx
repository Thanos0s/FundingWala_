import React, { useState } from 'react';
import { PixelIcon } from './PixelIcon';

export const MilestoneEscrowPanel = ({
  milestones = [],
  onVote,
  votingState = {},
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const handleVote = async (milestoneId, approve) => {
    try {
      setSelectedMilestone(milestoneId);
      if (onVote) await onVote(milestoneId, approve);
    } catch (e) {
      console.error(e);
    } finally {
      setSelectedMilestone(null);
    }
  };

  return (
    <div className="pixel-box p-6 md:p-8 bg-white font-pixel-body">
      <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#D4E751] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
            <PixelIcon name="lock" className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="font-pixel-heading text-sm md:text-base font-bold text-black uppercase">
              MILESTONE ESCROW
            </h3>
            <p className="text-[10px] text-gray-600 font-bold mt-0.5">3-STAGE TRANCHE RELEASES</p>
          </div>
        </div>
        <span className="text-[10px] bg-black text-[#D4E751] font-bold px-2 py-1 border border-black">
          ON-CHAIN VAULT
        </span>
      </div>

      <p className="text-xs text-gray-700 font-bold mb-5 leading-relaxed">
        Funds are locked in smart contract escrow and released in phases only when milestones are verified and approved by community backer vote.
      </p>

      <div className="space-y-4">
        {milestones.map((m) => {
          const totalVotes = m.approvals + m.rejections;
          const approvalPct = totalVotes > 0 ? Math.round((m.approvals / totalVotes) * 100) : 100;
          const isVotingThis = selectedMilestone === m.id && votingState.status === 'voting';

          return (
            <div
              key={m.id}
              className={`border-3 border-black p-4 transition-all shadow-[3px_3px_0px_0px_#000] ${
                m.released
                  ? 'bg-[#EBF7A7]'
                  : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] bg-black text-white font-bold px-1.5 py-0.5">
                      PHASE {m.id}
                    </span>
                    <h4 className="font-pixel-heading text-xs font-bold text-black">{m.title}</h4>
                  </div>
                  <div className="text-xs text-gray-700 font-bold mt-1.5">
                    Tranche: <span className="font-pixel-heading text-black text-xs">{m.targetAmount} XLM</span>
                  </div>
                </div>

                <div>
                  {m.released ? (
                    <span className="inline-flex items-center text-[10px] font-bold bg-green-600 text-white border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]">
                      RELEASED
                    </span>
                  ) : m.disputed ? (
                    <span className="inline-flex items-center text-[10px] font-bold bg-red-600 text-white border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]">
                      DISPUTED
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[10px] font-bold bg-[#D4E751] text-black border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]">
                      IN ESCROW
                    </span>
                  )}
                </div>
              </div>

              {/* Voting Bar */}
              <div className="mt-3 pt-3 border-t-2 border-black flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="text-gray-700 font-bold flex items-center space-x-2 text-[11px]">
                  <span>APPROVAL:</span>
                  <span className="text-black font-extrabold">{approvalPct}%</span>
                  <span className="text-gray-500">
                    ({m.approvals} YES / {m.rejections} NO)
                  </span>
                </div>

                {!m.released && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVote(m.id, true)}
                      disabled={isVotingThis}
                      className="pixel-btn bg-[#22C55E] text-white px-3 py-1 text-[10px] font-bold"
                    >
                      {isVotingThis ? '...' : 'APPROVE'}
                    </button>
                    <button
                      onClick={() => handleVote(m.id, false)}
                      disabled={isVotingThis}
                      className="pixel-btn bg-[#EF4444] text-white px-3 py-1 text-[10px] font-bold"
                    >
                      FLAG
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MilestoneEscrowPanel;
