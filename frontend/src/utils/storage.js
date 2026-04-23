export const TOKEN_KEY = "tms_token";
export const USER_KEY = "tms_user";
export const PROFILE_KEY = "tms_profile";

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const getStoredUser = () => JSON.parse(localStorage.getItem(USER_KEY) || "null");
export const getStoredProfile = () => JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");

export const persistSession = ({ token, user, profile }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile || null));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(PROFILE_KEY);
};
