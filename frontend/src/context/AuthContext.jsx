import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import api from "../api";
import Spinner from "../components/ui/Spinner";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fitnessPlan, setFitnessPlan] = useState(null);
  const [todaySummary, setTodaySummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // This function is now the single source of truth for fetching all user-related data
  const refetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: userData } = await api.get("/users/me");
      setUser(userData);

      const { data: planData } = await api.get("/fitness/plan");
      setFitnessPlan(planData);

      const { data: summaryData } = await api.get("/dashboard/today");
      setTodaySummary(summaryData);
    } catch (error) {
      // This will be hit if the token is invalid or the user has no plan yet
      setUser(null);
      setFitnessPlan(null);
      setTodaySummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // We still run this on initial load to check for an existing session cookie
    refetchData();
  }, [refetchData]);

  // *FIX IS HERE: Centralized authentication functions
  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    // After logging in via API, refetch all associated data
    await refetchData();
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.post("/auth/register", userData);
    // After registering, refetch all data to establish the session
    await refetchData();
    return data;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    // Clear all state locally after logging out
    setUser(null);
    setFitnessPlan(null);
    setTodaySummary(null);
  };

  const authContextValue = useMemo(
    () => ({
      user,
      fitnessPlan,
      todaySummary,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin || false,
      loading,
      refetchData,
      // add the new functions
      login,
      register,
      logout,
    }),
    [user, fitnessPlan, todaySummary, loading, refetchData]
  );

  // The initial loading screen is now more robust
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
