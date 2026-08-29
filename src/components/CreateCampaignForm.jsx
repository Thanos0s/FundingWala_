import React, { useState } from 'react';
import { PixelIcon } from './PixelIcon';

const CATEGORIES = [
  'Clean Water',
  'Open Source',
  'Solar Energy',
  'Education',
  'Healthcare',
  'Community',
];

const PRESET_GOALS = [500, 1000, 2500, 5000, 10000];

export const CreateCampaignForm = ({ onCreateCampaign, onSuccess, connected = false }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Clean Water');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('1000');
  const [durationDays, setDurationDays] = useState('30');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const goalNum = parseFloat(goal) || 0;
  const m1Amt = Math.round(goalNum * 0.3);
  const m2Amt = Math.round(goalNum * 0.4);
  const m3Amt = Math.max(0, goalNum - m1Amt - m2Amt);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || title.trim().length < 3) {
      setError('PROJECT TITLE MUST BE AT LEAST 3 CHARACTERS.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setError('PROJECT DESCRIPTION MUST BE AT LEAST 10 CHARACTERS.');
      return;
    }
    if (!goalNum || goalNum < 10) {
      setError('MINIMUM CAMPAIGN GOAL IS 10 XLM.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (onCreateCampaign) {
        await onCreateCampaign({
          title,
          category,
          description,
          goal: goalNum,
          durationDays: parseInt(durationDays, 10) || 30,
        });
      }
      setSuccess(true);
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="pixel-box p-6 md:p-8 bg-white text-center space-y-4 max-w-2xl mx-auto font-pixel-body">
        <div className="w-16 h-16 bg-[#D4E751] border-3 border-black shadow-[3px_3px_0px_0px_#000] mx-auto flex items-center justify-center">
          <PixelIcon name="check" className="w-10 h-10 text-black" />
        </div>
        <h2 className="font-pixel-heading text-lg font-bold text-black">
          CAMPAIGN LAUNCHED!
        </h2>
        <p className="bg-green-100 border-2 border-black p-3 text-xs font-bold text-green-900">
          YOUR CROWDFUNDING INITIATIVE <strong>&ldquo;{title}&rdquo;</strong> IS NOW LIVE ON STELLAR!
        </p>
        <p className="text-[11px] text-gray-600">
          3-Stage Milestone Escrow Tranches ({m1Amt} XLM / {m2Amt} XLM / {m3Amt} XLM) have been configured.
        </p>
        <button
          onClick={onSuccess}
          className="pixel-btn pixel-btn-accent px-6 py-3 text-xs font-bold shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
        >
          VIEW ACTIVE CAMPAIGN ➔
        </button>
      </div>
    );
  }

  return (
    <div className="pixel-box p-6 md:p-8 bg-white max-w-3xl mx-auto font-pixel-body space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 border-b-3 border-black pb-4">
        <div className="w-12 h-12 bg-[#D4E751] border-3 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] flex-shrink-0">
          <PixelIcon name="sparkle" className="w-7 h-7 text-black" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-pixel-heading text-base md:text-lg font-bold text-black uppercase">
            LAUNCH CROWDFUNDING PROJECT
          </h2>
          <p className="text-xs font-bold text-gray-600 mt-1">
            DECENTRALIZED STELLAR SOROBAN INITIATIVE
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-3 border-red-600 p-4 shadow-[3px_3px_0px_0px_#000] text-xs font-bold text-red-900 flex items-start space-x-2">
          <PixelIcon name="alert" className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-700" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Title */}
        <div>
          <label className="block text-xs font-bold uppercase mb-2">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Solar Microgrid for Kisumu Community"
            className="pixel-input w-full text-xs font-mono"
            required
          />
        </div>

        {/* Category Chips */}
        <div>
          <label className="block text-xs font-bold uppercase mb-2">
            Project Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold border-2 border-black transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
                  category === cat
                    ? 'bg-black text-[#D4E751]'
                    : 'bg-gray-100 text-black hover:bg-yellow-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-xs font-bold uppercase mb-2">
            Project Mission & Story <span className="text-red-500">*</span>
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the initiative, target impact, and why backers should support this on Stellar..."
            className="pixel-input w-full text-xs font-mono leading-relaxed"
            required
          />
        </div>

        {/* Goal & Timeline Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-2">
              Funding Goal (XLM) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="10"
                step="10"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="1000"
                className="pixel-input w-full pr-16 text-xs font-mono"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-pixel-heading text-[10px] font-bold bg-black text-white px-2 py-1">
                XLM
              </span>
            </div>

            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {PRESET_GOALS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setGoal(String(preset))}
                  className={`text-[10px] font-bold px-2 py-0.5 border border-black active:translate-x-0.5 active:translate-y-0.5 ${
                    goal === String(preset)
                      ? 'bg-black text-[#D4E751]'
                      : 'bg-white text-black hover:bg-yellow-200'
                  }`}
                >
                  {preset.toLocaleString()} XLM
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-2">
              Campaign Duration (Days)
            </label>
            <select
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              className="pixel-input w-full text-xs font-mono cursor-pointer"
            >
              <option value="15">15 Days (Quick Sprint)</option>
              <option value="30">30 Days (Standard Campaign)</option>
              <option value="60">60 Days (Extended)</option>
              <option value="90">90 Days (Quarterly Initiative)</option>
            </select>
          </div>
        </div>

        {/* 3-Stage Escrow Tranche Preview */}
        <div className="border-3 border-black p-4 bg-yellow-50 space-y-3 shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <div className="flex items-center space-x-2">
              <PixelIcon name="lock" className="w-4 h-4 text-black" />
              <span className="font-pixel-heading text-xs font-bold text-black uppercase">
                3-STAGE ESCROW TRANCHES
              </span>
            </div>
            <span className="text-[10px] bg-black text-[#D4E751] font-bold px-2 py-0.5">
              SMART VAULT
            </span>
          </div>

          <p className="text-[11px] text-gray-700 font-medium">
            Funds will be safely locked in on-chain escrow and released only upon backer approval:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="bg-white border-2 border-black p-2.5 space-y-1 shadow-[2px_2px_0px_0px_#000]">
              <span className="text-[9px] bg-black text-white font-bold px-1.5 py-0.5">
                PHASE 1 (30%)
              </span>
              <p className="font-bold text-[11px]">Planning & Setup</p>
              <p className="font-mono text-xs font-bold text-green-700">{m1Amt} XLM</p>
            </div>

            <div className="bg-white border-2 border-black p-2.5 space-y-1 shadow-[2px_2px_0px_0px_#000]">
              <span className="text-[9px] bg-black text-white font-bold px-1.5 py-0.5">
                PHASE 2 (40%)
              </span>
              <p className="font-bold text-[11px]">Core Execution</p>
              <p className="font-mono text-xs font-bold text-green-700">{m2Amt} XLM</p>
            </div>

            <div className="bg-white border-2 border-black p-2.5 space-y-1 shadow-[2px_2px_0px_0px_#000]">
              <span className="text-[9px] bg-black text-white font-bold px-1.5 py-0.5">
                PHASE 3 (30%)
              </span>
              <p className="font-bold text-[11px]">Final Delivery</p>
              <p className="font-mono text-xs font-bold text-green-700">{m3Amt} XLM</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="pixel-btn pixel-btn-accent w-full py-4 text-sm md:text-base flex items-center justify-center space-x-2 font-bold shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
        >
          <PixelIcon name="sparkle" className="w-5 h-5 text-black" />
          <span>{isSubmitting ? 'DEPLOYING CAMPAIGN...' : '🚀 LAUNCH CAMPAIGN ON STELLAR'}</span>
        </button>
      </form>
    </div>
  );
};

export default CreateCampaignForm;
