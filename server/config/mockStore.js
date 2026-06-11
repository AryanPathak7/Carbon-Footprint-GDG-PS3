// In-memory data store for AwareSphere backend database fallback

export let mockUsers = [
  {
    _id: 'user_citizen_1',
    name: 'Aravind Sharma',
    email: 'citizen@awaresphere.org',
    role: 'citizen',
    ageGroup: 'adult',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    points: 320,
    level: 'Contributor',
    badges: [
      { name: 'Eco Warrior', icon: '🌱', awardedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { name: 'Digital Zen', icon: '🧘', awardedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
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
    interests: ['Environmental', 'Digital Wellbeing', 'Road Safety'],
    lastActiveDate: new Date(),
    save: async function() { return this; }
  },
  {
    _id: 'user_ngo_1',
    name: 'Green Earth Foundation',
    email: 'ngo@greenearth.org',
    role: 'ngo',
    ageGroup: 'adult',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    points: 1200,
    level: 'Awareness Champion',
    badges: [{ name: 'Community Organizer', icon: '🤝', awardedAt: new Date() }],
    streak: 12,
    digitalDetox: { screenTimeGoal: 180, screenTimeLogs: [] },
    familyId: '',
    schoolId: '',
    interests: ['Environmental', 'Social Responsibility'],
    lastActiveDate: new Date(),
    save: async function() { return this; }
  },
  {
    _id: 'user_admin_1',
    name: 'AwareSphere Moderator',
    email: 'admin@awaresphere.org',
    role: 'admin',
    ageGroup: 'adult',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    points: 5000,
    level: 'Awareness Champion',
    badges: [{ name: 'Grand Arbiter', icon: '⚖️', awardedAt: new Date() }],
    streak: 25,
    digitalDetox: { screenTimeGoal: 240, screenTimeLogs: [] },
    familyId: '',
    schoolId: '',
    interests: [],
    lastActiveDate: new Date(),
    save: async function() { return this; }
  }
];

export let mockCampaigns = [
  {
    _id: 'camp_1',
    title: 'Cleanliness Drive & Plastic Audit',
    description: 'Join hands to clean up Sector 15 Park and separate plastics for recycling. Learn plastic audit guidelines!',
    category: 'Environmental',
    ngoId: 'user_ngo_1',
    ngoName: 'Green Earth Foundation',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Central Park, Sector 15, New Delhi'
    },
    startDate: new Date('2026-06-14T09:00:00.000Z'),
    endDate: new Date('2026-06-14T13:00:00.000Z'),
    volunteers: ['user_citizen_1'],
    attendance: [],
    status: 'active',
    pointsReward: 100,
    createdAt: new Date()
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
    startDate: new Date('2026-06-20T10:00:00.000Z'),
    endDate: new Date('2026-06-20T12:00:00.000Z'),
    volunteers: [],
    attendance: [],
    status: 'active',
    pointsReward: 120,
    createdAt: new Date()
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
    startDate: new Date('2026-06-16T08:00:00.000Z'),
    endDate: new Date('2026-06-16T16:00:00.000Z'),
    volunteers: [],
    attendance: [],
    status: 'active',
    pointsReward: 150,
    createdAt: new Date()
  }
];

export let mockChallenges = [
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

export let mockReels = [
  {
    _id: 'reel_1',
    title: 'Spotting SMS Fraud in 60s',
    url: '/videos/AQObZPBHkLPRHoQyQiNRSig4VBW2ZavOU0khOlKnhF0WzIMdg9Hj4DGOJl3bIIESP3J6nWqYCELhtcX1xZ9dmxvOmGDKsSm4h1bzBxI.mp4',
    category: 'Cyber Fraud Prevention',
    likes: 245,
    saves: 110,
    quiz: {
      question: 'Which of the following is a sign of SMS phishing?',
      options: ['Direct bank URL with https', 'Urgent demand to verify KYC link immediately', 'Simple greeting from a friend'],
      answerIndex: 1,
      explanation: 'Phishing texts almost always create false urgency and direct you to unverified external websites.'
    }
  },
  {
    _id: 'reel_2',
    title: 'Plastic Audit: Home Edition',
    url: '/videos/AQNMxtBY6x6Uk1i1ofEM8PXLL5d-l3_PAiXyZhn4UtDZ8hdkzNMF0xCMNqP3JM-pb8IjueY43zyV4XhivXBhm1sUlD9d5E8sweuBNCU.mp4',
    category: 'Climate Change',
    likes: 389,
    saves: 202,
    quiz: {
      question: 'What is the first step of a household plastic audit?',
      options: ['Burning the plastics', 'Throwing everything in general waste', 'Segregating plastic items by resin code number'],
      answerIndex: 2,
      explanation: 'Resin codes (1-7) indicate the type of plastic polymer and tell recycling centers how to process it.'
    }
  },
  {
    _id: 'reel_3',
    title: 'Digital Detox 20-20-20 Rule',
    url: '/videos/AQN4z94MPubxPHXRSiCaa5PM9nbRZ6UrdwU4qF_O9VBkNl13C2c_FmkQEDE4cxFLzC7ihGeH_saQv4xdkyN05FQoCgjOfJDX2fr5Cgk.mp4',
    category: 'Digital Detox',
    likes: 188,
    saves: 95,
    quiz: {
      question: 'According to 20-20-20 rule, how far should you look away?',
      options: ['20 yards', '20 feet', '20 centimeters'],
      answerIndex: 1,
      explanation: 'Every 20 minutes, focus your eyes on an object at least 20 feet away for at least 20 seconds.'
    }
  },
  {
    _id: 'reel_4',
    title: 'Mindfulness & Box Breathing',
    url: '/videos/AQMc1gRGzsVL4lI19Fuy6LjY5Wi1A5oZD0yJxnwQP729n7ozaCj0tQ2N9rkq4lq2waeS14s2_DqPPb1hrNj4P1kpIB6i5XWKRJGYk5U.mp4',
    category: 'Mental Health',
    likes: 412,
    saves: 180,
    quiz: {
      question: 'What is the standard duration for each phase in box breathing?',
      options: ['2 seconds', '4 seconds', '8 seconds'],
      answerIndex: 1,
      explanation: 'Box breathing uses a 4-second count for inhaling, holding, exhaling, and keeping empty.'
    }
  },
  {
    _id: 'reel_5',
    title: 'Cycle Safety: Helmet Fits',
    url: '/videos/AQMYMfRoBD3g7hZ-2_a4QIXl0v_T43Y2ethU_OlFaltN-WXjCiOgl-qz9dBoTlMe4Gof_agqQTb05nx9FOfweK3-.mp4',
    category: 'Health Awareness',
    likes: 156,
    saves: 45,
    quiz: {
      question: 'How snug should a cycling helmet be?',
      options: ['Extremely loose', 'Level on head, snug enough to move scalp slightly when rocked', 'Tilted backward'],
      answerIndex: 1,
      explanation: 'Helmets must sit level on your forehead and fit snug enough that rocking it moves your scalp slightly.'
    }
  }
];

export let mockActionLogs = [
  {
    _id: 'act_1',
    userId: 'user_citizen_1',
    actionType: 'quiz',
    category: 'Environmental',
    description: 'Completed Climate Change Quiz with 100%',
    pointsEarned: 50,
    socialImpactMetrics: { treesPlanted: 1, plasticRecycledKg: 0, volunteerHours: 0, screenTimeReducedMins: 0 },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    _id: 'act_2',
    userId: 'user_citizen_1',
    actionType: 'detox_goal',
    category: 'Digital Wellbeing',
    description: 'Met Screen Time target: logged 95 mins (Goal: 120 mins)',
    pointsEarned: 20,
    socialImpactMetrics: { treesPlanted: 0, plasticRecycledKg: 0, volunteerHours: 0, screenTimeReducedMins: 25 },
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];
