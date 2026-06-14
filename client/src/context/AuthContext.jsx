import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockDb, initializeMockDb } from '../utils/mockDb';

const AuthContext = createContext();

const API_URL = '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('awaresphere_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialise mock database on load
    initializeMockDb();
    
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await fetch(`${API_URL}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            // Token invalid or expired - try local storage fallback
            fallbackLocalUser();
          }
        } catch (err) {
          console.warn('Backend server connection failed. Falling back to Mock DB.');
          fallbackLocalUser();
        }
      } else {
        setLoading(false);
      }
    };

    const fallbackLocalUser = () => {
      const storedUser = localStorage.getItem('awaresphere_current_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Log in default user for demo convenience
        const users = mockDb.getUsers();
        const defaultCitizen = users[0];
        setUser(defaultCitizen);
        localStorage.setItem('awaresphere_current_user', JSON.stringify(defaultCitizen));
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setUser(data);
        localStorage.setItem('awaresphere_token', data.token);
        localStorage.setItem('awaresphere_current_user', JSON.stringify(data));
        setLoading(false);
        return true;
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Login failed');
      }
    } catch (err) {
      console.warn('Logging in locally via Mock DB due to API failure:', err.message);
      
      const users = mockDb.getUsers();
      const matched = users.find(u => u.email === email && u.password === password);
      
      if (matched) {
        setUser(matched);
        setToken('mock_token_abc');
        localStorage.setItem('awaresphere_token', 'mock_token_abc');
        localStorage.setItem('awaresphere_current_user', JSON.stringify(matched));
        setLoading(false);
        return true;
      } else {
        setError('Invalid credentials');
        setLoading(false);
        return false;
      }
    }
  };

  const register = async (name, email, password, role, ageGroup, schoolId, interests) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, ageGroup, schoolId, interests })
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setUser(data);
        localStorage.setItem('awaresphere_token', data.token);
        localStorage.setItem('awaresphere_current_user', JSON.stringify(data));
        setLoading(false);
        return true;
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Registration failed');
      }
    } catch (err) {
      console.warn('Registering locally in Mock DB due to API failure:', err.message);
      
      const users = mockDb.getUsers();
      const exists = users.some(u => u.email === email);
      if (exists) {
        setError('User already exists');
        setLoading(false);
        return false;
      }

      const newUser = {
        _id: 'user_' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        password,
        role: role || 'citizen',
        ageGroup: ageGroup || 'adult',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        points: 0,
        level: 'Explorer',
        badges: [],
        streak: 1,
        digitalDetox: { screenTimeGoal: 120, screenTimeLogs: [] },
        familyId: '',
        schoolId: schoolId || '',
        interests: interests || []
      };

      users.push(newUser);
      mockDb.setUsers(users);
      
      setUser(newUser);
      setToken('mock_token_abc');
      localStorage.setItem('awaresphere_token', 'mock_token_abc');
      localStorage.setItem('awaresphere_current_user', JSON.stringify(newUser));
      setLoading(false);
      return true;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('awaresphere_token');
    localStorage.removeItem('awaresphere_current_user');
  };

  // Switch Role / User type easily during hackathon testing
  const selectDemoUser = async (userId) => {
    const users = mockDb.getUsers();
    const matched = users.find(u => u._id === userId);
    if (matched) {
      await login(matched.email, 'password');
    }
  };

  // Awareness-to-Action Reward logger helper
  const recordAction = async (actionData) => {
    // actionData: { actionType, category, description, pointsEarned, socialImpactMetrics }
    if (token && token !== 'mock_token_abc') {
      try {
        const res = await fetch(`${API_URL}/actions/log`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(actionData)
        });
        if (res.ok) {
          const data = await res.json();
          // Update profile points
          setUser(prev => ({
            ...prev,
            points: data.newPoints,
            level: data.newLevel
          }));
          return;
        }
      } catch (err) {
        console.warn('API logging failed, running locally');
      }
    }

    // Local Mock DB Action Logging
    const currentActions = mockDb.getActions();
    const newLog = {
      _id: 'act_' + Math.random().toString(36).substr(2, 9),
      userId: user._id,
      timestamp: new Date().toISOString(),
      ...actionData
    };
    currentActions.push(newLog);
    mockDb.setActions(currentActions);

    // Update user locally
    const users = mockDb.getUsers();
    const idx = users.findIndex(u => u._id === user._id);
    if (idx > -1) {
      users[idx].points += actionData.pointsEarned || 0;
      
      // Level thresholds
      let level = 'Explorer';
      const pts = users[idx].points;
      if (pts > 1000) level = 'Awareness Champion';
      else if (pts > 500) level = 'Influencer';
      else if (pts > 250) level = 'Contributor';
      else if (pts > 100) level = 'Learner';
      
      users[idx].level = level;
      
      // Auto-assign first milestone badge
      if (pts > 100 && !users[idx].badges.some(b => b.name === 'Quick Starter')) {
        users[idx].badges.push({ name: 'Quick Starter', icon: '🚀', awardedAt: new Date().toISOString() });
      }

      mockDb.setUsers(users);
      setUser(users[idx]);
      localStorage.setItem('awaresphere_current_user', JSON.stringify(users[idx]));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        selectDemoUser,
        recordAction,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
