import React, { useState } from 'react';
import { useContract } from '../hooks/useContract';
import { validationService } from '../services/validationService';
import { CONFIG } from '../config';

export const NFTMintForm = ({ connected, onMintStart, onMintSuccess }) => {
  const { mintNFT, loading } = useContract();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    uri: '',
  });
  
  const [errors, setErrors] = useState({});
  const [minting, setMinting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (field) => {
    const fieldErrors = {};
    
    if (field === 'name') {
      const nameErrors = validationService.validateName(formData.name);
      if (nameErrors.length > 0) {
        fieldErrors.name = nameErrors[0];
      }
    } else if (field === 'description') {
      const descErrors = validationService.validateDescription(formData.description);
      if (descErrors.length > 0) {
        fieldErrors.description = descErrors[0];
      }
    } else if (field === 'uri') {
      const uriErrors = validationService.validateURI(formData.uri);
      if (uriErrors.length > 0) {
        fieldErrors.uri = uriErrors[0];
      }
    }
    
    setErrors((prev) => ({
      ...prev,
      ...fieldErrors,
    }));
  };

  const validateForm = () => {
    const newErrors = validationService.validateMetadata(
      formData.name,
      formData.description,
      formData.uri
    );
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setMinting(true);
    if (onMintStart) {
      onMintStart();
    }

    try {
      const result = await mintNFT(
        validationService.sanitize(formData.name),
        validationService.sanitize(formData.description),
        validationService.sanitize(formData.uri)
      );

      // Reset form
      setFormData({
        name: '',
        description: '',
        uri: '',
      });
      setErrors({});

      if (onMintSuccess) {
        onMintSuccess(result);
      }
    } catch (err) {
      console.error('Minting error:', err);
      alert('Minting failed. Please check the console for details.');
    } finally {
      setMinting(false);
    }
  };

  const isFormValid = validationService.isFormValid(
    formData.name,
    formData.description,
    formData.uri
  );

  return (
    <div className="nft-mint-form-container">
      <form onSubmit={handleSubmit} className="nft-mint-form space-y-4">
        <h2 className="text-2xl font-bold mb-6">Mint NFT</h2>

        {/* Name Field */}
        <div className="form-group">
          <label className="label">
            <span className="label-text font-semibold">
              NFT Name <span className="text-red-500">*</span>
            </span>
            <span className="label-text-alt text-gray-500">
              {formData.name.length}/{CONFIG.MAX_NAME_LENGTH}
            </span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={() => handleBlur('name')}
            placeholder="Enter NFT name"
            maxLength={CONFIG.MAX_NAME_LENGTH}
            disabled={minting || !connected}
            className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
          />
          {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label className="label">
            <span className="label-text font-semibold">Description</span>
            <span className="label-text-alt text-gray-500">
              {formData.description.length}/{CONFIG.MAX_DESCRIPTION_LENGTH}
            </span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            onBlur={() => handleBlur('description')}
            placeholder="Enter NFT description (optional)"
            maxLength={CONFIG.MAX_DESCRIPTION_LENGTH}
            rows="4"
            disabled={minting || !connected}
            className={`textarea textarea-bordered w-full ${errors.description ? 'textarea-error' : ''}`}
          />
          {errors.description && (
            <p className="text-error text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* URI Field */}
        <div className="form-group">
          <label className="label">
            <span className="label-text font-semibold">
              Content URI <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            type="text"
            name="uri"
            value={formData.uri}
            onChange={handleInputChange}
            onBlur={() => handleBlur('uri')}
            placeholder="https://example.com/nft.jpg"
            disabled={minting || !connected}
            className={`input input-bordered w-full ${errors.uri ? 'input-error' : ''}`}
          />
          {errors.uri && <p className="text-error text-sm mt-1">{errors.uri}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!connected || minting || !isFormValid || loading}
          className="btn btn-primary w-full"
        >
          {minting || loading ? (
            <>
              <span className="loading loading-spinner"></span>
              Minting NFT...
            </>
          ) : (
            'Mint NFT'
          )}
        </button>

        {!connected && (
          <p className="text-warning text-sm text-center">
            Please connect your wallet to mint an NFT
          </p>
        )}
      </form>
    </div>
  );
};
