import axios from "axios";
import MemberRequest from "../models/requests/MemberRequest";
import LoginRequest from "../models/requests/SignInRequest";
import MemberRespons from "../models/responses/MemberRespons";

export function useSignIn(): (member: LoginRequest) => Promise<boolean> {
  return async (member: LoginRequest) => {
    try {
      const res = await axios.post("http://localhost:8080/sign-in", member);
      signIn(res.data);
      return true;
    } catch (_) {
      return false;
    }
  };
}

export function useSignUp(): (member: MemberRequest) => Promise<string> {
  return async (member: MemberRequest) => {
    try {
      const res = await axios.post("http://localhost:8080/sign-up", member);

      if (res.data === "중복") {
        return res.data;
      } else {
        signIn(res.data);
        return;
      }
    } catch (_) {
      return "실패";
    }
  };
}

export function useFindMember(): (id: number) => Promise<MemberRespons> {
  return async (id: number) => {
    try {
      const res = await axios.get<MemberRespons>(
        `http://localhost:8080/mem/${id}`
      );
      return res.data;
    } catch (_) {
      return {
        id: -1,
        name: "-",
        email: "-",
        message: "",
      };
    }
  };
}

export function useCheckEmail(): (email: string) => Promise<boolean> {
  return async (email: string) => {
    const body = await axios.post("http://localhost:8080/checkEmail", {
      email: email,
    });
    return body.data;
  };
}

function signIn(token: string) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  localStorage.setItem("token", token);
}
