import axios from "axios";
import MemberRequest from "../models/requests/MemberRequest";
import SignInRequest from "../models/requests/SignInRequest";
import MemberResponse from "../models/responses/MemberResponse";

export function useSignIn(): (member: SignInRequest) => Promise<boolean> {
  return (member: SignInRequest) => {
    return axios
      .post("http://localhost:8080/sign-in", member)
      .then((r) => {
        signIn(r.data);
        return true;
      })
      .catch((_) => false);
  };
}

export function useSignUp(): (member: MemberRequest) => Promise<string> {
  return (member: MemberRequest) => {
    return axios
      .post("http://localhost:8080/sign-up", member)
      .then((r) => {
        signIn(r.data);
        return;
      })
      .catch((e) => {
        if (e.response?.data === "중복") {
          return e.response?.data;
        } else {
          return "실패";
        }
      });
  };
}

export function useFindMember(): (id: number) => Promise<MemberResponse> {
  return (id: number) => {
    return axios
      .get<MemberResponse>(`http://localhost:8080/mem/${id}`)
      .then((r) => r.data)
      .catch((_) => {
        return {
          id: -1,
          name: "-",
          email: "-",
          message: "",
        };
      });
  };
}

export function useCheckEmail(): (email: string) => Promise<boolean> {
  return (email: string) => {
    return axios
      .post("http://localhost:8080/checkEmail", {
        email: email,
      })
      .then((b) => b.data);
  };
}

function signIn(token: string) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  localStorage.setItem("token", token);
}
