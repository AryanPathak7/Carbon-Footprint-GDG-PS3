import { describe, it, expect } from 'vitest';
import { getAIChatResponse } from '../controllers/aiController.js';

describe('AI Persona Response Logic', () => {
  it('should return child cyber safety fallback response when prompt contains cyber safety keywords and persona is child', async () => {
    const req = {
      body: {
        prompt: 'tell me about cyber safety',
        ageGroup: 'child'
      }
    };
    
    let responseData = null;
    const res = {
      json: (data) => {
        responseData = data;
        return res;
      },
      status: (code) => {
        return res;
      }
    };

    await getAIChatResponse(req, res);

    expect(responseData).toBeDefined();
    expect(responseData.response).toContain('explorer');
    expect(responseData.response).toContain('🛡️');
  });

  it('should return senior cyber safety fallback response when prompt contains cyber safety keywords and persona is senior', async () => {
    const req = {
      body: {
        prompt: 'scam security online',
        ageGroup: 'senior'
      }
    };
    
    let responseData = null;
    const res = {
      json: (data) => {
        responseData = data;
        return res;
      },
      status: (code) => {
        return res;
      }
    };

    await getAIChatResponse(req, res);

    expect(responseData).toBeDefined();
    expect(responseData.response).toContain('virtual front door');
  });

  it('should return error 400 when prompt is missing', async () => {
    const req = {
      body: {
        ageGroup: 'adult'
      }
    };
    
    let statusCode = null;
    let responseData = null;
    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        responseData = data;
        return res;
      }
    };

    await getAIChatResponse(req, res);

    expect(statusCode).toBe(400);
    expect(responseData.message).toBe('Prompt is required');
  });
});
