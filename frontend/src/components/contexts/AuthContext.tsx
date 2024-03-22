import axios from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";
import SignInResponse from "../../models/responses/SignInResponse";
import storage from "../../utils/Storage";

interface IAuthContext {
  memberId: number;
  token: string;
  authenticated: boolean;
  signIn: (_: SignInResponse) => void;
  signOut: () => void;
  autoSignIn: () => void;
}

const initialValue = {
  memberId: -999,
  token: "",
  authenticated: false,
  signIn: (_: SignInResponse) => {},
  signOut: () => {},
  autoSignIn: () => {},
};

const AuthContext = createContext<IAuthContext>(initialValue);

const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(
    initialValue.authenticated
  );
  const [token, setToken] = useState(initialValue.token);
  const [memberId, setMemberId] = useState(initialValue.memberId);

  useEffect(() => {
    if (!authenticated && !!token) {
      setAuthenticated(true);
    }
  }, [authenticated, token]);

  const signIn = (res: SignInResponse) => {
    storage.set("token", res.token);
    storage.set("accessExpired", res.accessExpired);
    setMemberId(res.id);

    setAuth(res.token);
  };

  const signOut = () => {
    setToken("");
    setAuthenticated(false);
    storage.remove("token");
    storage.remove("accessExpired");
    axios.defaults.headers.common["Authorization"] = "";
  };

  const autoSignIn = () => {
    const token = storage.get("token");
    const accessExpired = storage.get("accessExpired");

    if (
      !token ||
      (accessExpired && new Date(accessExpired).getTime() < Date.now())
    ) {
      if (authenticated) {
        signOut();
      }

      return;
    }

    setAuth(token);
  };

  const setAuth = (token: string) => {
    setAuthenticated(true);
    setToken(token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  return (
    <AuthContext.Provider
      value={{
        memberId,
        token,
        authenticated,
        signIn,
        signOut,
        autoSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
