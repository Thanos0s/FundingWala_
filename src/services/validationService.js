import { CONFIG } from '../config';

export class ValidationService {
  /**
   * Validate NFT name
   */
  static validateName(name) {
    const errors = [];
    
    if (!name || name.trim().length === 0) {
      errors.push('Name is required');
    } else if (name.length > CONFIG.MAX_NAME_LENGTH) {
      errors.push(`Name must be max ${CONFIG.MAX_NAME_LENGTH} characters`);
    }
    
    return errors;
  }

  /**
   * Validate NFT description
   */
  static validateDescription(description) {
    const errors = [];
    
    if (description.length > CONFIG.MAX_DESCRIPTION_LENGTH) {
      errors.push(`Description must be max ${CONFIG.MAX_DESCRIPTION_LENGTH} characters`);
    }
    
    return errors;
  }

  /**
   * Validate URI
   */
  static validateURI(uri) {
    const errors = [];
    
    if (!uri || uri.trim().length === 0) {
      errors.push('URI is required');
    } else {
      try {
        new URL(uri);
      } catch (e) {
        errors.push('URI must be a valid URL');
      }
    }
    
    return errors;
  }

  /**
   * Validate all metadata
   */
  static validateMetadata(name, description, uri) {
    const errors = {};
    
    const nameErrors = this.validateName(name);
    if (nameErrors.length > 0) {
      errors.name = nameErrors[0];
    }
    
    const descErrors = this.validateDescription(description);
    if (descErrors.length > 0) {
      errors.description = descErrors[0];
    }
    
    const uriErrors = this.validateURI(uri);
    if (uriErrors.length > 0) {
      errors.uri = uriErrors[0];
    }
    
    return errors;
  }

  /**
   * Check if form is valid
   */
  static isFormValid(name, description, uri) {
    const errors = this.validateMetadata(name, description, uri);
    return Object.keys(errors).length === 0;
  }

  /**
   * Sanitize string input
   */
  static sanitize(input) {
    if (typeof input !== 'string') return '';
    return input.trim();
  }

  /**
   * Validate token ID
   */
  static validateTokenId(tokenId) {
    const id = parseInt(tokenId, 10);
    return !isNaN(id) && id > 0;
  }
}

export const validationService = new ValidationService();
