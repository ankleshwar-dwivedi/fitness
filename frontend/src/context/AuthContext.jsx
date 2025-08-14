import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import api from '../api';
import Spinner from '../components/ui/Spinner';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fitnessPlan, setFitnessPlan] = useState(null); // New state for fitness plan
  const [loading, setLoading] = useState(true);

  const fetchInitialData = useCallback(async () => {
    try {
      const { data: userData } = await api.get('/users/me');
      setUser(userData);
      try {
        const { data: planData } = await api.get('/fitness/plan');
        setFitnessPlan(planData);
      } catch (planError) {
        setFitnessPlan(null); // No plan exists for the user
      }
    } catch (error) {
      setUser(null);
      setFitnessPlan(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const authContextValue = useMemo(() => ({
    user,
    setUser,
    fitnessPlan,
    setFitnessPlan, // Expose setter to be used by Profile page
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    loading,
    refetchData: fetchInitialData // Allow components to trigger a refetch
  }), [user, fitnessPlan, loading, fetchInitialData]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-primary">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};