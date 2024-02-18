import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../components/contexts/AuthContext";

export function useSignOut() {
  const { signOut } = useContext(AuthContext);

  return () => {
    localStorage.removeItem("token");
    signOut();
  };
}
