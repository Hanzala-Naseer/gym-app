// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext(undefined);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("gymkey_token");
//     const storedUser = localStorage.getItem("gymkey_user");

//     if (storedToken && storedUser) {
//       try {
//         setToken(storedToken);
//         setUser(JSON.parse(storedUser));
//       } catch {
//         // corrupted storage — clear it
//         localStorage.removeItem("gymkey_token");
//         localStorage.removeItem("gymkey_user");
//       }
//     }

//     setIsLoading(false);
//   }, []);

//   // ── login: accepts token + user object from /api/auth/login response ─────
//   // Backend returns: { token, user: { id, name, email } }
//   // The JWT payload carries { sub: id, role }, so we need to decode it
//   // OR the /me endpoint returns the full user with role. We support both.
//   const login = (newToken, newUser) => {
//     // Decode JWT to extract role if not already present
//     let userWithRole = newUser;
//     if (!newUser.role && newToken) {
//       try {
//         const payload = JSON.parse(atob(newToken.split(".")[1]));
//         userWithRole = { ...newUser, role: payload.role };
//       } catch {
//         // ignore decode errors
//       }
//     }

//     setToken(newToken);
//     setUser(userWithRole);
//     localStorage.setItem("gymkey_token", newToken);
//     localStorage.setItem("gymkey_user", JSON.stringify(userWithRole));
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem("gymkey_token");
//     localStorage.removeItem("gymkey_user");
//   };

//   // Update user profile data (e.g. after /me fetch)
//   const updateUser = (updates) => {
//     const updated = { ...user, ...updates };
//     setUser(updated);
//     localStorage.setItem("gymkey_user", JSON.stringify(updated));
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         isLoading,
//         login,
//         logout,
//         updateUser,
//         isAuthenticated: !!user,
//       }}
//     >
//       {!isLoading && children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ─────────────────────────────────────────────
  // LOAD AUTH FROM SESSION STORAGE
  // FIXES MULTI-TAB ROLE CONFLICT
  // ─────────────────────────────────────────────
  useEffect(() => {
    try {
      const storedToken =
        sessionStorage.getItem("gymkey_token");

      const storedUser =
        sessionStorage.getItem("gymkey_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Auth restore error:", err);

      sessionStorage.removeItem("gymkey_token");
      sessionStorage.removeItem("gymkey_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────
  const login = (newToken, newUser = {}) => {
    try {
      let decodedPayload = {};

      if (newToken) {
        // JWT Base64URL decode
        const base64Url = newToken.split(".")[1];

        const base64 = base64Url
          .replace(/-/g, "+")
          .replace(/_/g, "/");

        decodedPayload = JSON.parse(window.atob(base64));
      }

      // Merge backend user + JWT payload
      const userData = {
        ...newUser,

        id: newUser.id || decodedPayload.id,
        email: newUser.email || decodedPayload.email,
        role: newUser.role || decodedPayload.role,

        gymId: newUser.gymId || null,
      };

      setToken(newToken);
      setUser(userData);

      sessionStorage.setItem(
        "gymkey_token",
        newToken
      );

      sessionStorage.setItem(
        "gymkey_user",
        JSON.stringify(userData)
      );

      console.log("Logged in user:", userData);
    } catch (err) {
      console.error("Login parse error:", err);
    }
  };

  // ─────────────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);

    sessionStorage.removeItem("gymkey_token");
    sessionStorage.removeItem("gymkey_user");
  };

  // ─────────────────────────────────────────────
  // UPDATE GYM ID
  // ─────────────────────────────────────────────
  const updateGymId = (gymId) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      gymId,
    };

    setUser(updatedUser);

    sessionStorage.setItem(
      "gymkey_user",
      JSON.stringify(updatedUser)
    );
  };

  // ─────────────────────────────────────────────
  // UPDATE USER PROFILE
  // ─────────────────────────────────────────────
  const updateUser = (updates) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...updates,
    };

    setUser(updatedUser);

    sessionStorage.setItem(
      "gymkey_user",
      JSON.stringify(updatedUser)
    );
  };

  // ─────────────────────────────────────────────
  // PROVIDER
  // ─────────────────────────────────────────────
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,

        login,
        logout,

        updateGymId,
        updateUser,

        isAuthenticated: !!token,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────
// CUSTOM HOOK
// ─────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}