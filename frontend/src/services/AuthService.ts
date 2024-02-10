import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../components/contexts/AuthContext";

export function useSignOut() {
  const { setAuthenticated } = useContext(AuthContext);

  return () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    axios.defaults.headers.common["Authorization"] = "";
  };
}
