import React, { useState } from 'react';
import { useContract } from '../hooks/useContract';
import { validationService } from '../services/validationService';

export const NFTDisplay = ({ connected }) => {
  const { getNFT, loading, error, result } = useContract();
  
  const [tokenId, setTokenId] = useState('');
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!validationService.validateTokenId(tokenId)) {
      alert('Please enter a valid token ID');
      return;
    }

    setSearchAttempted(true);
    try {
      await getNFT(parseInt(tokenId, 10));
    } catch (err) {
      console.error('Error fetching NFT:', err);
    }
  };

  return (
    <div className="nft-display-container">
      <form onSubmit={handleSearch} className="nft-search-form space-y-4 mb-6">
        <h2 className="text-2xl font-bold">Query NFT</h2>
        
        <div className="form-group">
          <label className="label">
            <span className="label-text font-semibold">Token ID</span>
          </label>
          <div className="input-group flex gap-2">
            <input
              type="number"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter NFT Token ID"
              disabled={loading || !connected}
              min="1"
              className="input input-bordered flex-1"
            />
            <button
              type="submit"
              disabled={!connected || loading || !tokenId}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>
          
          {!connected && (
            <p className="text-warning text-sm mt-2">
              Please connect your wallet to query NFTs
            </p>
          )}
        </div>
      </form>

      {/* Error Display */}
      {error && searchAttempted && (
        <div className="alert alert-error mb-4">
          <svg
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m8-8l2 2m0 0l2 2m-2-2l-2 2m2-2l2-2"
            />
          </svg>
          <span>
            {error.message || 'NFT with this ID does not exist'}
          </span>
        </div>
      )}

      {/* NFT Display */}
      {result && searchAttempted && (
        <div className="nft-result">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">{result.name}</h2>
              
              <div className="divider"></div>

              <div className="nft-details space-y-3">
                <div className="detail-item">
                  <span className="label-text font-semibold">Token ID:</span>
                  <span className="badge badge-lg">{result.token_id}</span>
                </div>

                {result.description && (
                  <div className="detail-item">
                    <span className="label-text font-semibold">Description:</span>
                    <p className="text-gray-700 mt-1">{result.description}</p>
                  </div>
                )}

                {result.uri && (
                  <div className="detail-item">
                    <span className="label-text font-semibold">Content URI:</span>
                    <a
                      href={result.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary break-all"
                    >
                      {result.uri}
                    </a>
                  </div>
                )}

                {result.owner && (
                  <div className="detail-item">
                    <span className="label-text font-semibold">Owner:</span>
                    <code className="bg-gray-100 p-2 rounded font-mono text-sm block break-all">
                      {result.owner}
                    </code>
                  </div>
                )}
              </div>

              <div className="card-actions justify-end mt-4">
                <button
                  onClick={() => {
                    if (result.owner) {
                      navigator.clipboard.writeText(result.owner);
                      alert('Owner address copied!');
                    }
                  }}
                  className="btn btn-sm btn-secondary"
                >
                  Copy Owner
                </button>
                {result.uri && (
                  <a
                    href={result.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary"
                  >
                    View Content
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && searchAttempted && !error && (
        <div className="alert alert-info">
          <svg
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Enter a Token ID and click Search to find an NFT</span>
        </div>
      )}
    </div>
  );
};
