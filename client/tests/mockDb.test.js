import { describe, it, expect, beforeAll } from 'vitest';

// Mock localStorage for Node.js testing environment
beforeAll(() => {
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => { store[key] = String(value); },
      clear: () => { store = {}; },
      removeItem: (key) => { delete store[key]; }
    };
  })();
  globalThis.localStorage = localStorageMock;
});

import { mockDb } from '../src/utils/mockDb.js';

describe('Mock Frontend Database Tests', () => {
  it('should retrieve default reels list with proper structures', () => {
    const reels = mockDb.getReels();
    expect(reels).toBeInstanceOf(Array);
    expect(reels.length).toBeGreaterThan(0);
    expect(reels[0].url).toBeDefined();
    expect(reels[0].quiz).toBeDefined();
    expect(reels[0].quiz.options).toBeInstanceOf(Array);
  });

  it('should retrieve correct quizzes by category', () => {
    const cyberQuizzes = mockDb.getQuizzesByCategory('Cyber Safety');
    expect(cyberQuizzes).toBeInstanceOf(Array);
    expect(cyberQuizzes.length).toBeGreaterThan(0);
  });

  it('should default to Digital Wellbeing quizzes if category is invalid or missing', () => {
    const defaultQuizzes = mockDb.getQuizzesByCategory('Non-existent Category');
    expect(defaultQuizzes).toBeInstanceOf(Array);
    expect(defaultQuizzes.length).toBeGreaterThan(0);
  });
});
