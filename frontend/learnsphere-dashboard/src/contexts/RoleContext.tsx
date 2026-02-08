import { createContext, useContext, useState, ReactNode } from "react";

type Role = "learner" | "instructor";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  toggleRole: () => void;
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("learner");
  const [isAuthenticated, setAuthenticated] = useState(false);

  const toggleRole = () => {
    setRole(prev => (prev === "learner" ? "instructor" : "learner"));
  };

  const logout = () => {
    setAuthenticated(false);
    setRole("learner");
  };

  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole, isAuthenticated, setAuthenticated, logout }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRole must be used within RoleProvider");
  return context;
}
