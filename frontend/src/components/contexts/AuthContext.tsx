import axios from "axios";
import { ReactNode, createContext, useState } from "react";
import Member from "../../models/domains/Member";
import SignInResponse from "../../models/responses/SignInResponse";
import storage from "../../utils/Storage";

interface IAuthContext {
  token: string;
  member: Member;
  authenticated: boolean;
  signIn: (_: SignInResponse) => void;
  signOut: () => void;
  setToken: (token: string) => void;
}

const defaultMember: Member = { id: -1, name: "-", email: "-" };

const initialValue = {
  token: "",
  member: defaultMember,
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
  const [member, setMember] = useState(initialValue.member);
  const [token, setToken] = useState(initialValue.token);

  const signIn = (res: SignInResponse) => {
    setMember({ id: res.id, name: res.name, email: res.email });
    setAuthenticated(true);
    setTokenHandler(res.token);
  };

  const signOut = () => {
    setMember(defaultMember);
    setAuthenticated(false);
    setTokenHandler("");
  };

  const setTokenHandler = (token: string) => {
    setToken(token);

    if (token != "") {
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
        member,
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
