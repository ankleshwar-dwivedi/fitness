import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import api from '../api';
import Spinner from '../components/ui/Spinner';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fitnessPlan, setFitnessPlan] = useState(null);
  const [todaySummary, setTodaySummary] = useState(null); // FIX IS HERE: Add summary state
  const [loading, setLoading] = useState(true);

  const fetchInitialData = useCallback(async () => {
    // This function now fetches everything needed for the dashboard
    try {
      const { data: userData } = await api.get('/users/me');
      setUser(userData);
      
      // These calls depend on a user being logged in
      try {
        const { data: planData } = await api.get('/fitness/plan');
        setFitnessPlan(planData);
        
        // Now fetch the summary data as well
        const { data: summaryData } = await api.get('/dashboard/today');
        setTodaySummary(summaryData);

      } catch (planOrSummaryError) {
        // If plan or summary fails, it's not a critical auth error
        setFitnessPlan(null);
        setTodaySummary(null);
      }
    } catch (error) {
      // This catch is for when the user is not authenticated at all
      setUser(null);
      setFitnessPlan(null);
      setTodaySummary(null);
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
    setFitnessPlan,
    todaySummary, // Expose summary data
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    loading,
    refetchData: fetchInitialData // This function now refetches everything
  }), [user, fitnessPlan, todaySummary, loading, fetchInitialData]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-light">
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