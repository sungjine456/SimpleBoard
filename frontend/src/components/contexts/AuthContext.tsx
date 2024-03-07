import axios from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";
import SignInResponse from "../../models/responses/SignInResponse";
import storage from "../../utils/Storage";

interface IAuthContext {
  token: string;
  authenticated: boolean;
  signIn: (_: SignInResponse) => void;
  signOut: () => void;
  setToken: (token: string) => void;
}

const initialValue = {
  token: "",
  authenticated: false,
  signIn: (_: SignInResponse) => {},
  signOut: () => {},
  setToken: (_: string) => {},
};

const AuthContext = createContext<IAuthContext>(initialValue);

const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(
    initialValue.authenticated
  );
  const [token, setToken] = useState(initialValue.token);

  useEffect(() => {
    if (!authenticated && !!token) {
      setAuthenticated(true);
    }
  }, [authenticated, token]);

  const signIn = (res: SignInResponse) => {
    setAuthenticated(true);
    setTokenHandler(res.token);
  };

  const signOut = () => {
    setAuthenticated(false);
    setTokenHandler("");
  };

  const setTokenHandler = (token: string) => {
    setToken(token);

    if (token) {
      storage.set("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      storage.remove("token");
      axios.defaults.headers.common["Authorization"] = "";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        authenticated,
        signIn,
        signOut,
        setToken: setTokenHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
