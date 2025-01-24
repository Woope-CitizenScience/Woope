import React, { createContext, useState, ReactNode } from "react";

interface AuthContextType {
  userToken: string | null;
  setUserToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  setUserToken: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ userToken, setUserToken }}>
      {children}
    </AuthContext.Provider>
  );
};
