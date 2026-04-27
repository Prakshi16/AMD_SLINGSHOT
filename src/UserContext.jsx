import { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nourishme_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // onboardingData persists to sessionStorage so it survives
  // page refreshes between Step 1 → Step 2
  const [onboardingData, setOnboardingDataState] = useState(() => {
    const saved = sessionStorage.getItem('nourishme_onboarding');
    return saved
      ? JSON.parse(saved)
      : { dietStyle: '', goals: [], allergies: [] };
  });

  const setOnboardingData = (data) => {
    setOnboardingDataState(data);
    sessionStorage.setItem('nourishme_onboarding', JSON.stringify(data));
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('nourishme_profile', JSON.stringify(user));
    }
  }, [user]);

  const saveProfile = (profileData) => {
    const fullProfile = {
      ...onboardingData,
      ...profileData,
      createdAt: new Date().toISOString(),
    };
    setUser(fullProfile);
    localStorage.setItem('nourishme_profile', JSON.stringify(fullProfile));
    // Clear onboarding temp data after profile is saved
    sessionStorage.removeItem('nourishme_onboarding');
    setOnboardingDataState({ dietStyle: '', goals: [], allergies: [] });
  };

  const updateProfile = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('nourishme_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nourishme_profile');
  };

  const getAge = () => {
    if (!user?.dob) return 0;
    const today = new Date();
    const birth = new Date(user.dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const getBMI = () => {
    if (!user?.height || !user?.weight) return 0;
    const heightM = user.height / 100;
    return (user.weight / (heightM * heightM)).toFixed(1);
  };

  const getBMICategory = () => {
    const bmi = parseFloat(getBMI());
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500', bg: 'bg-blue-100' };
    if (bmi < 25) return { label: 'Healthy', color: 'text-green-600', bg: 'bg-green-100' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Obese', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getInitials = () => {
    if (!user?.name) return '??';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      onboardingData,
      setOnboardingData,
      saveProfile,
      updateProfile,
      logout,
      getAge,
      getBMI,
      getBMICategory,
      getInitials,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}

export default UserContext;
