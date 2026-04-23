import { createContext, useContext, useEffect, useState } from "react";
import { authClient, userClient } from "../api/client";
import {
  clearSession,
  getStoredProfile,
  getStoredToken,
  getStoredUser,
  persistSession
} from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(getStoredUser());
  const [profile, setProfile] = useState(getStoredProfile());
  const [loading, setLoading] = useState(true);

  const refreshProfile = async (tokenArg = token, userArg = user) => {
    if (!tokenArg || !userArg?.id) {
      return null;
    }

    try {
      const response = await userClient.get("/users/me/profile", {
        headers: {
          Authorization: `Bearer ${tokenArg}`
        }
      });
      const matchedProfile = response.data.data || null;
      setProfile(matchedProfile);
      persistSession({ token: tokenArg, user: userArg, profile: matchedProfile });
      return matchedProfile;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!token || !user) {
        setLoading(false);
        return;
      }

      try {
        await authClient.get("/auth/verify");
        await refreshProfile(token, user);
      } catch (error) {
        clearSession();
        setToken(null);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const register = async (payload) => {
    const authResponse = await authClient.post("/auth/register", {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role
    });

    const authUser = authResponse.data.user;
    const sessionToken = authResponse.data.token;

    const profileResponse = await userClient.post("/users", {
      authUserId: authUser.id,
      name: payload.name,
      email: payload.email,
      department: payload.department,
      designation: payload.designation,
      phone: payload.phone,
      role: payload.role
    }, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    });

    persistSession({
      token: sessionToken,
      user: authUser,
      profile: profileResponse.data.data
    });

    setToken(sessionToken);
    setUser(authUser);
    setProfile(profileResponse.data.data);

    return authResponse.data;
  };

  const login = async (payload) => {
    const response = await authClient.post("/auth/login", payload);
    const nextUser = response.data.user;
    const nextToken = response.data.token;
    setToken(nextToken);
    setUser(nextUser);
    persistSession({ token: nextToken, user: nextUser, profile: null });
    const nextProfile = await refreshProfile(nextToken, nextUser);
    setProfile(nextProfile);
    return response.data;
  };

  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        profile,
        loading,
        isAuthenticated: Boolean(token),
        register,
        login,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
