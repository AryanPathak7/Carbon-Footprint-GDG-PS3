// Local storage keys
const KEYS = {
  USERS: 'awaresphere_users',
  CAMPAIGNS: 'awaresphere_campaigns',
  CHALLENGES: 'awaresphere_challenges',
  ACTIONS: 'awaresphere_actions',
  CURRENT_USER: 'awaresphere_current_user',
  TOKEN: 'awaresphere_token',
  REELS: 'awaresphere_reels'
};

const DEFAULT_USERS = [
  {
    _id: 'user_citizen_1',
    name: 'Aravind Sharma',
    email: 'citizen@awaresphere.org',
    password: 'password',
    role: 'citizen',
    ageGroup: 'adult',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    points: 320,
    level: 'Contributor',
    badges: [
      { name: 'Eco Warrior', icon: '🌱', awardedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Digital Zen', icon: '🧘', awardedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    streak: 5,
    digitalDetox: {
      screenTimeGoal: 120, // mins
      screenTimeLogs: [
        { date: '2026-06-08', duration: 150 },
        { date: '2026-06-09', duration: 110 },
        { date: '2026-06-10', duration: 95 },
        { date: '2026-06-11', duration: 80 }
      ]
    },
    familyId: 'fam_123',
    schoolId: 'Greenwood High School',
    interests: ['Environmental', 'Digital Wellbeing', 'Road Safety']
  },
  {
    _id: 'user_ngo_1',
    name: 'Green Earth Foundation',
    email: 'ngo@greenearth.org',
    password: 'password',
    role: 'ngo',
    ageGroup: 'adult',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    points: 1200,
    level: 'Awareness Champion',
    badges: [{ name: 'Community Organizer', icon: '🤝', awardedAt: new Date().toISOString() }],
    streak: 12,
    digitalDetox: { screenTimeGoal: 180, screenTimeLogs: [] },
    familyId: '',
    schoolId: '',
    interests: ['Environmental', 'Social Responsibility']
  },
  {
    _id: 'user_admin_1',
    name: 'AwareSphere Moderator',
    email: 'admin@awaresphere.org',
    password: 'password',
    role: 'admin',
    ageGroup: 'adult',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    points: 5000,
    level: 'Awareness Champion',
    badges: [{ name: 'Grand Arbiter', icon: '⚖️', awardedAt: new Date().toISOString() }],
    streak: 25,
    digitalDetox: { screenTimeGoal: 240, screenTimeLogs: [] },
    familyId: '',
    schoolId: '',
    interests: []
  },
  {
    _id: 'user_child_1',
    name: 'Leo Sharma',
    email: 'leo@family.com',
    password: 'password',
    role: 'citizen',
    ageGroup: 'child',
    avatar: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&w=150&q=80',
    points: 80,
    level: 'Explorer',
    badges: [{ name: 'Good Touch Safety Star', icon: '⭐', awardedAt: new Date().toISOString() }],
    streak: 2,
    digitalDetox: { screenTimeGoal: 60, screenTimeLogs: [{ date: '2026-06-11', duration: 45 }] },
    familyId: 'fam_123',
    schoolId: 'Greenwood High School',
    interests: ['Cyber Safety', 'Environmental']
  },
  {
    _id: 'user_senior_1',
    name: 'Savitri Sharma',
    email: 'savitri@family.com',
    password: 'password',
    role: 'citizen',
    ageGroup: 'senior',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    points: 150,
    level: 'Learner',
    badges: [{ name: 'Scam Proof Shield', icon: '🛡️', awardedAt: new Date().toISOString() }],
    streak: 3,
    digitalDetox: { screenTimeGoal: 150, screenTimeLogs: [{ date: '2026-06-11', duration: 110 }] },
    familyId: 'fam_123',
    schoolId: '',
    interests: ['Cyber Safety', 'Health & Fitness']
  }
];

const DEFAULT_CAMPAIGNS = [
  {
    _id: 'camp_1',
    title: 'Cleanliness Drive & Plastic Audit',
    description: 'Join hands to clean up Sector 15 Park and separate plastics for recycling. Learn plastic audit guidelines!',
    category: 'Environmental',
    ngoId: 'user_ngo_1',
    ngoName: 'Green Earth Foundation',
    location: {
      lat: 28.6139,
      lng: 77.2090, // Delhi coordinates
      address: 'Central Park, Sector 15, New Delhi'
    },
    startDate: '2026-06-14T09:00:00.000Z',
    endDate: '2026-06-14T13:00:00.000Z',
    volunteers: ['user_citizen_1'],
    attendance: [],
    status: 'active',
    pointsReward: 100,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'camp_2',
    title: 'Digital Safety Workshop for Seniors',
    description: 'An interactive workshop teaching senior citizens how to spot financial phishing scams and operate online banking safely.',
    category: 'Cyber Safety',
    ngoId: 'user_ngo_1',
    ngoName: 'Safe Cyber Association',
    location: {
      lat: 28.6250,
      lng: 77.2150,
      address: 'Community Center Hall, Connaught Place, New Delhi'
    },
    startDate: '2026-06-20T10:00:00.000Z',
    endDate: '2026-06-20T12:00:00.000Z',
    volunteers: [],
    attendance: [],
    status: 'active',
    pointsReward: 120,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'camp_3',
    title: 'Blood Donation Camp',
    description: 'Donate blood and save lives. In partnership with the Red Cross Society, volunteer or donate at our center.',
    category: 'Health & Fitness',
    ngoId: 'user_ngo_1',
    ngoName: 'Red Cross Chapter',
    location: {
      lat: 28.5900,
      lng: 77.2200,
      address: 'Red Cross Hospital Ground, New Delhi'
    },
    startDate: '2026-06-16T08:00:00.000Z',
    endDate: '2026-06-16T16:00:00.000Z',
    volunteers: [],
    attendance: [],
    status: 'active',
    pointsReward: 150,
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_CHALLENGES = [
  {
    _id: 'chall_1',
    title: 'No Social Media Sunday',
    description: 'Spend your Sunday completely off social media to reset your digital health.',
    category: 'Digital Wellbeing',
    pointsReward: 80,
    durationDays: 1,
    participants: [
      { userId: 'user_citizen_1', status: 'active', submittedAt: null }
    ]
  },
  {
    _id: 'chall_2',
    title: 'Plant a Tree Challenge',
    description: 'Plant a sapling in your local community, take a picture, and upload it.',
    category: 'Environmental',
    pointsReward: 120,
    durationDays: 7,
    participants: []
  },
  {
    _id: 'chall_3',
    title: 'Walk 5000 Steps Daily',
    description: 'Keep physically active by walking at least 5000 steps every day for a week.',
    category: 'Health & Fitness',
    pointsReward: 100,
    durationDays: 7,
    participants: []
  },
  {
    _id: 'chall_4',
    title: 'Help an Elderly Person',
    description: 'Assist a senior citizen in your neighborhood with groceries, tech support, or simple chores.',
    category: 'Social Responsibility',
    pointsReward: 150,
    durationDays: 3,
    participants: []
  }
];

const DEFAULT_ACTIONS = [
  {
    _id: 'act_1',
    userId: 'user_citizen_1',
    actionType: 'quiz',
    category: 'Environmental',
    description: 'Completed Climate Change Quiz with 100%',
    pointsEarned: 50,
    socialImpactMetrics: { treesPlanted: 1, plasticRecycledKg: 0, volunteerHours: 0, screenTimeReducedMins: 0 },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'act_2',
    userId: 'user_citizen_1',
    actionType: 'detox_goal',
    category: 'Digital Wellbeing',
    description: 'Met Screen Time target: logged 95 mins (Goal: 120 mins)',
    pointsEarned: 20,
    socialImpactMetrics: { treesPlanted: 0, plasticRecycledKg: 0, volunteerHours: 0, screenTimeReducedMins: 25 },
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const DEFAULT_LEADERBOARD = [
  { rank: 1, name: 'National Institute of Technology', points: 4800, membersCount: 42, volunteerHours: 120 },
  { rank: 2, name: 'Greenwood High School', points: 3650, membersCount: 35, volunteerHours: 94 },
  { rank: 3, name: 'St. Xavier College', points: 3100, membersCount: 28, volunteerHours: 80 },
  { rank: 4, name: 'Delhi Public School', points: 2900, membersCount: 20, volunteerHours: 65 },
  { rank: 5, name: 'Model Senior Secondary School', points: 1200, membersCount: 15, volunteerHours: 30 }
];

const DEFAULT_REELS = [
  {
    id: 'reel_1',
    title: 'Spotting SMS Fraud in 60s',
    url: '/videos/AQObZPBHkLPRHoQyQiNRSig4VBW2ZavOU0khOlKnhF0WzIMdg9Hj4DGOJl3bIIESP3J6nWqYCELhtcX1xZ9dmxvOmGDKsSm4h1bzBxI.mp4',
    category: 'Cyber Fraud Prevention',
    likes: 245,
    saves: 110,
    quiz: {
      question: 'Which of the following is a sign of SMS phishing?',
      options: ['Direct bank URL with https', 'Urgent demand to verify KYC link immediately', 'Simple greeting from a friend'],
      answer: 1,
      explanation: 'Phishing texts almost always create false urgency and direct you to unverified external websites.'
    }
  },
  {
    id: 'reel_2',
    title: 'Plastic Audit: Home Edition',
    url: '/videos/AQNMxtBY6x6Uk1i1ofEM8PXLL5d-l3_PAiXyZhn4UtDZ8hdkzNMF0xCMNqP3JM-pb8IjueY43zyV4XhivXBhm1sUlD9d5E8sweuBNCU.mp4',
    category: 'Climate Change',
    likes: 389,
    saves: 202,
    quiz: {
      question: 'What is the first step of a household plastic audit?',
      options: ['Burning the plastics', 'Throwing everything in general waste', 'Segregating plastic items by resin code number'],
      answer: 2,
      explanation: 'Resin codes (1-7) indicate the type of plastic polymer and tell recycling centers how to process it.'
    }
  },
  {
    id: 'reel_3',
    title: 'Digital Detox 20-20-20 Rule',
    url: '/videos/AQN4z94MPubxPHXRSiCaa5PM9nbRZ6UrdwU4qF_O9VBkNl13C2c_FmkQEDE4cxFLzC7ihGeH_saQv4xdkyN05FQoCgjOfJDX2fr5Cgk.mp4',
    category: 'Digital Detox',
    likes: 188,
    saves: 95,
    quiz: {
      question: 'According to 20-20-20 rule, how far should you look away?',
      options: ['20 yards', '20 feet', '20 centimeters'],
      answer: 1,
      explanation: 'Every 20 minutes, focus your eyes on an object at least 20 feet away for at least 20 seconds.'
    }
  },
  {
    id: 'reel_4',
    title: 'Mindfulness & Box Breathing',
    url: '/videos/AQMc1gRGzsVL4lI19Fuy6LjY5Wi1A5oZD0yJxnwQP729n7ozaCj0tQ2N9rkq4lq2waeS14s2_DqPPb1hrNj4P1kpIB6i5XWKRJGYk5U.mp4',
    category: 'Mental Health',
    likes: 412,
    saves: 180,
    quiz: {
      question: 'What is the standard duration for each phase in box breathing?',
      options: ['2 seconds', '4 seconds', '8 seconds'],
      answer: 1,
      explanation: 'Box breathing uses a 4-second count for inhaling, holding, exhaling, and keeping empty.'
    }
  },
  {
    id: 'reel_5',
    title: 'Cycle Safety: Helmet Fits',
    url: '/videos/AQMYMfRoBD3g7hZ-2_a4QIXl0v_T43Y2ethU_OlFaltN-WXjCiOgl-qz9dBoTlMe4Gof_agqQTb05nx9FOfweK3-.mp4',
    category: 'Health Awareness',
    likes: 156,
    saves: 45,
    quiz: {
      question: 'How snug should a cycling helmet be?',
      options: ['Extremely loose', 'Level on head, snug enough to move scalp slightly when rocked', 'Tilted backward'],
      answer: 1,
      explanation: 'Helmets must sit level on your forehead and fit snug enough that rocking it moves your scalp slightly.'
    }
  }
];

export const getStorageData = (key, defaultData) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
};

export const setStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const initializeMockDb = () => {
  getStorageData(KEYS.USERS, DEFAULT_USERS);
  getStorageData(KEYS.CAMPAIGNS, DEFAULT_CAMPAIGNS);
  getStorageData(KEYS.CHALLENGES, DEFAULT_CHALLENGES);
  getStorageData(KEYS.ACTIONS, DEFAULT_ACTIONS);

  // Sanitize loaded reels to migrate old external URLs to reliable local paths
  const loadedReels = getStorageData(KEYS.REELS, DEFAULT_REELS);
  let hasChanges = false;
  const sanitized = loadedReels.map(reel => {
    if (reel.url && (reel.url.includes('commondatastorage.googleapis.com') || reel.url.includes('mixkit.co'))) {
      const match = DEFAULT_REELS.find(d => d.id === reel.id || d.title === reel.title);
      if (match) {
        hasChanges = true;
        return { ...reel, url: match.url };
      }
    }
    return reel;
  });
  if (hasChanges) {
    setStorageData(KEYS.REELS, sanitized);
  }
};

export const mockDb = {
  getKeys: () => KEYS,

  getUsers: () => getStorageData(KEYS.USERS, DEFAULT_USERS),
  setUsers: (users) => setStorageData(KEYS.USERS, users),

  getCampaigns: () => getStorageData(KEYS.CAMPAIGNS, DEFAULT_CAMPAIGNS),
  setCampaigns: (campaigns) => setStorageData(KEYS.CAMPAIGNS, campaigns),

  getChallenges: () => getStorageData(KEYS.CHALLENGES, DEFAULT_CHALLENGES),
  setChallenges: (challenges) => setStorageData(KEYS.CHALLENGES, challenges),

  getActions: () => getStorageData(KEYS.ACTIONS, DEFAULT_ACTIONS),
  setActions: (actions) => setStorageData(KEYS.ACTIONS, actions),

  getLeaderboard: () => DEFAULT_LEADERBOARD,

  // Reels details
  getReels: () => getStorageData(KEYS.REELS, DEFAULT_REELS),
  setReels: (reels) => setStorageData(KEYS.REELS, reels),

  // Quiz Engine questions
  getQuizzesByCategory: (category) => {
    const quizzes = {
      'Digital Wellbeing': [
        {
          question: "What is the primary indicator of digital screen dependency?",
          options: ["Checking emails once an hour", "Feelings of anxiety or restlessness when phone is inaccessible", "Using a laptop for school homework"],
          answer: 1,
          explanation: "Anxiety, phantom vibration syndrome, or compulsive checking are classic signs of digital dependency."
        },
        {
          question: "How does blue light affect sleep quality?",
          options: ["It increases deep sleep cycles", "It suppresses melatonin production needed for circadian rhythm", "It has no biological effect"],
          answer: 1,
          explanation: "Blue light emitted by screens blocks melatonin production, shifting your sleep cycle and reducing deep sleep."
        }
      ],
      'Cyber Safety': [
        {
          question: "What does MFA stand for in security accounts?",
          options: ["Multi-Factor Authentication", "Main Firewall Association", "Mobile File Access"],
          answer: 0,
          explanation: "MFA (Multi-Factor Authentication) requires users to provide two or more verification factors to gain access."
        },
        {
          question: "You receive an email claiming your bank card is locked. It contains a direct login link. What should you do?",
          options: ["Click the link and verify your login info immediately", "Delete the email, or check by calling the bank direct support number", "Forward it to your friends"],
          answer: 1,
          explanation: "Banks never request urgent credentials via direct links in emails. Check your account by navigating to the bank portal independently."
        }
      ],
      'Environmental': [
        {
          question: "Which of the following plastics are the most widely recycled?",
          options: ["PET (Type 1) and HDPE (Type 2)", "PVC (Type 3) and PS (Type 6)", "Bioplastics"],
          answer: 0,
          explanation: "Type 1 (PET/Water bottles) and Type 2 (HDPE/Milk jugs) are highly recyclable and widely accepted."
        },
        {
          question: "What represents the highest source of carbon emission in a modern household?",
          options: ["Wasting tap water", "Heating, ventilation, and air conditioning (HVAC) electrical draws", "Leaving LED lights turned on"],
          answer: 1,
          explanation: "HVAC systems account for over 50% of typical home energy use, representing the largest single carbon footprint item."
        }
      ]
    };
    return quizzes[category] || quizzes['Digital Wellbeing'];
  }
};
