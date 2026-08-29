import React, { useState } from 'react';
import PixelIcon from './PixelIcon';

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
    <div className="bg-slate-900 border-4 border-slate-700 p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <PixelIcon name="lock" size={24} className="text-yellow-400" />
          <h3 className="text-xl font-bold font-mono tracking-wider text-yellow-400">
            MILESTONE ESCROW VAULT
          </h3>
        </div>
        <span className="text-xs bg-yellow-400/20 text-yellow-300 font-mono px-2 py-1 border border-yellow-400/40">
          3-STAGE TRANCHES
        </span>
      </div>

      <p className="text-xs text-slate-400 font-mono mb-4 leading-relaxed">
        Funds are locked in smart contract escrow and released in phases upon milestone completion and backer approval vote.
      </p>

      <div className="space-y-4">
        {milestones.map((m) => {
          const totalVotes = m.approvals + m.rejections;
          const approvalPct = totalVotes > 0 ? Math.round((m.approvals / totalVotes) * 100) : 100;
          const isVotingThis = selectedMilestone === m.id && votingState.status === 'voting';

          return (
            <div
              key={m.id}
              className={`border-2 p-3.5 transition-all ${
                m.released
                  ? 'border-green-500/60 bg-green-950/20'
                  : 'border-slate-700 bg-slate-800/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-700 text-slate-200 px-1.5 py-0.5">
                      STAGE {m.id}
                    </span>
                    <h4 className="font-bold text-white font-mono text-sm">{m.title}</h4>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    Tranche: <span className="text-yellow-400 font-bold">{m.targetAmount} XLM</span>
                  </div>
                </div>

                <div className="text-right">
                  {m.released ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-green-500/20 text-green-400 border border-green-500/40 px-2 py-0.5">
                      ✓ RELEASED
                    </span>
                  ) : m.disputed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5">
                      ⚠️ DISPUTED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5">
                      🔒 IN ESCROW
                    </span>
                  )}
                </div>
              </div>

              {/* Voting Bar */}
              <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs font-mono">
                <div className="text-slate-400 flex items-center gap-2">
                  <span>Approval:</span>
                  <span className="text-green-400 font-bold">{approvalPct}%</span>
                  <span className="text-slate-500">
                    ({m.approvals} 👍 / {m.rejections} 👎)
                  </span>
                </div>

                {!m.released && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleVote(m.id, true)}
                      disabled={isVotingThis}
                      className="px-2 py-1 text-[11px] font-bold bg-green-600 hover:bg-green-500 text-white border border-green-400 active:translate-y-0.5 transition-all disabled:opacity-50"
                      title="Approve milestone release"
                    >
                      {isVotingThis ? '...' : '👍 APPROVE'}
                    </button>
                    <button
                      onClick={() => handleVote(m.id, false)}
                      disabled={isVotingThis}
                      className="px-2 py-1 text-[11px] font-bold bg-red-800 hover:bg-red-700 text-white border border-red-500 active:translate-y-0.5 transition-all disabled:opacity-50"
                      title="Reject / Flag milestone"
                    >
                      👎 FLAG
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
