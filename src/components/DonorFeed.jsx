import React from 'react';
import { CONFIG } from '../config';
import { PixelIcon } from './PixelIcon';

const AVATAR_ICONS = ['bread', 'dino', 'peace', 'diamond', 'heart', 'coin', 'star'];

const formatAddress = (addr) => {
  if (!addr) return 'ANONYMOUS';
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

const DonationItem = ({ donation, index, isNew }) => {
  const iconName = AVATAR_ICONS[index % AVATAR_ICONS.length];

  return (
    <div
      className={`p-4 border-3 border-black shadow-[3px_3px_0px_0px_#000] transition-all duration-300 flex items-center justify-between ${
        isNew
          ? 'bg-[#FEF9C3] translate-x-[-2px] translate-y-[-2px] shadow-[5px_5px_0px_0px_#000]'
          : 'bg-white'
      }`}
    >
      <div className="flex items-center space-x-3 min-w-0">
        {/* Pixel Icon Avatar */}
        <div className="w-9 h-9 bg-[#D4E751] border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_0px_#000]">
          <PixelIcon name={iconName} className="w-5 h-5 text-black" />
        </div>

        <div className="min-w-0 font-pixel-body">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xs truncate">
              {formatAddress(donation.donor)}
            </span>
            {donation.isLocal && (
              <span className="text-[10px] bg-black text-yellow-300 font-bold px-1.5 py-0.5">
                YOU
              </span>
            )}
          </div>
          <p className="text-[10px] text-gray-500 uppercase mt-1">
            {donation.timestamp ? new Date(donation.timestamp).toLocaleTimeString() : 'RECENT'}
          </p>
        </div>
      </div>

      <div className="text-right flex-shrink-0 font-pixel-body ml-2">
        <p className="font-bold font-pixel-heading text-xs text-green-700 bg-green-100 border border-black px-2 py-1">
          +{donation.amount?.toFixed(1) || '0'} XLM
        </p>
        {donation.txHash && (
          <a
            href={`${CONFIG.STELLAR_EXPERT_URL}/tx/${donation.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-gray-700 underline font-bold hover:text-black block mt-1"
          >
            TX ↗
          </a>
        )}
      </div>
    </div>
  );
};

export const DonorFeed = ({ donations }) => {
  const [newestId, setNewestId] = React.useState(null);

  React.useEffect(() => {
    if (donations.length > 0) {
      const newest = donations[0];
      setNewestId(newest.id);
      const timer = setTimeout(() => setNewestId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [donations]);

  return (
    <div className="pixel-box p-6 md:p-8 bg-white space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b-3 border-black pb-4">
        <div className="flex items-center space-x-2">
          <PixelIcon name="peace" className="w-6 h-6" />
          <h3 className="font-pixel-heading text-sm md:text-base font-bold uppercase">
            Recent Donors
          </h3>
        </div>
        <div className="flex items-center space-x-1 bg-black text-[#D4E751] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
          <span className="w-2 h-2 bg-[#D4E751] animate-ping" />
          <span className="text-[10px] font-pixel-body font-bold">LIVE FEED</span>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-3.5">
        {donations.length === 0 ? (
          <div className="text-center py-10 bg-yellow-50 border-2 border-dashed border-black p-6">
            <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0px_0px_#000]">
              <PixelIcon name="bread" className="w-8 h-8" />
            </div>
            <p className="font-pixel-body text-xs font-bold">NO DONATIONS YET!</p>
            <p className="font-pixel-body text-[10px] text-gray-600 mt-2">
              BE THE FIRST RETRO HERO TO DONATE!
            </p>
          </div>
        ) : (
          donations.slice(0, 10).map((donation, idx) => (
            <DonationItem
              key={donation.id}
              donation={donation}
              index={idx}
              isNew={donation.id === newestId}
            />
          ))
        )}
      </div>

      {donations.length > 10 && (
        <p className="text-center text-xs font-pixel-body font-bold text-gray-600 pt-2">
          + {donations.length - 10} MORE DONATIONS
        </p>
      )}
    </div>
  );
};
