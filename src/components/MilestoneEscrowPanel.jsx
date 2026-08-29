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
    <div className="pixel-box p-6 md:p-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#D4E751] border-3 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] flex-shrink-0">
            <PixelIcon name="lock" className="w-7 h-7 text-black" />
          </div>
          <div>
            <h3 className="font-pixel-heading text-base md:text-lg font-bold text-black uppercase tracking-tight">
              MILESTONE ESCROW
            </h3>
            <p className="font-pixel-body text-xs text-gray-600 font-bold mt-1">
              3-STAGE TRANCHE RELEASES
            </p>
          </div>
        </div>
        <span className="font-pixel-body text-xs bg-black text-[#D4E751] font-bold px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          ON-CHAIN VAULT
        </span>
      </div>

      <p className="font-mono text-xs md:text-sm text-gray-700 font-medium mb-6 leading-relaxed bg-yellow-50 border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_#000]">
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
              className={`border-3 border-black p-4 md:p-5 transition-all shadow-[4px_4px_0px_0px_#000] space-y-3 ${
                m.released ? 'bg-[#F4FBE4]' : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-pixel-body text-[10px] bg-black text-white font-bold px-2 py-0.5">
                      PHASE {m.id}
                    </span>
                    <h4 className="font-pixel-heading text-xs md:text-sm font-bold text-black">
                      {m.title}
                    </h4>
                  </div>
                  <div className="font-mono text-xs md:text-sm text-gray-800 font-bold pt-1">
                    Tranche: <strong className="text-black">{m.targetAmount} XLM</strong>
                  </div>
                </div>

                <div>
                  {m.released ? (
                    <span className="font-pixel-body text-xs font-bold bg-green-600 text-white border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_0px_#000]">
                      RELEASED
                    </span>
                  ) : m.disputed ? (
                    <span className="font-pixel-body text-xs font-bold bg-red-600 text-white border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_0px_#000]">
                      DISPUTED
                    </span>
                  ) : (
                    <span className="font-pixel-body text-xs font-bold bg-[#D4E751] text-black border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_0px_#000]">
                      IN ESCROW
                    </span>
                  )}
                </div>
              </div>

              {/* Voting Bar */}
              <div className="pt-3 border-t-2 border-black flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <div className="text-gray-700 font-bold flex items-center space-x-2">
                  <span className="text-black font-extrabold">APPROVAL: {approvalPct}%</span>
                  <span className="text-gray-500">
                    ({m.approvals} YES / {m.rejections} NO)
                  </span>
                </div>

                {!m.released && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVote(m.id, true)}
                      disabled={isVotingThis}
                      className="pixel-btn bg-[#22C55E] text-white px-3 py-1.5 text-xs font-bold"
                    >
                      {isVotingThis ? '...' : 'APPROVE'}
                    </button>
                    <button
                      onClick={() => handleVote(m.id, false)}
                      disabled={isVotingThis}
                      className="pixel-btn bg-[#EF4444] text-white px-3 py-1.5 text-xs font-bold"
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
