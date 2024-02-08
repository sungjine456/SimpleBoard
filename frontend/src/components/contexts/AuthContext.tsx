import { ReactNode, createContext, useState } from "react";

interface Props {
  children?: ReactNode;
}

interface IAuthContext {
  authenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
}

const initialValue = {
  authenticated: !!localStorage.getItem("token"),
  setAuthenticated: (_: boolean) => {},
};

const AuthContext = createContext<IAuthContext>(initialValue);

const AuthProvider = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(
    initialValue.authenticated
  );

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
