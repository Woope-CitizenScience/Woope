import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  userToken: string | null;
  userRole: number | null; // role_id is a number
  setUserToken: (token: string | null) => void;
  setUserRole: (role: number | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  userRole: null,
  setUserToken: () => {},
  setUserRole: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userToken, setUserToken] = useState<string | null>(
    sessionStorage.getItem("accessToken")
  );
  const [userRole, setUserRole] = useState<number | null>(null);

  // Restore session on page refresh
  useEffect(() => {
    const storedToken = sessionStorage.getItem("accessToken");
    const storedRole = sessionStorage.getItem("userRole");

    if (storedToken) setUserToken(storedToken);
    if (storedRole) setUserRole(Number(storedRole)); // Parse role as number
  }, []);

  // Keep sessionStorage in sync when state updates
  useEffect(() => {
    if (userToken) {
      sessionStorage.setItem("accessToken", userToken);
    } else {
      sessionStorage.removeItem("accessToken");
    }

    if (userRole !== null) {
      sessionStorage.setItem("userRole", userRole.toString());
    } else {
      sessionStorage.removeItem("userRole");
    }
  }, [userToken, userRole]);

  return (
    <AuthContext.Provider
      value={{ userToken, userRole, setUserToken, setUserRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};
