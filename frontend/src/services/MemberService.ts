import axios from "axios";
import MemberToEmailRequest from "../models/requests/MemberToEmailRequest";
import MemberToIdRequest from "../models/requests/MemberToIdRequest";
import SignUpRequest from "../models/requests/SignUpRequest";
import MemberResponse from "../models/responses/MemberResponse";
import SignInResponse from "../models/responses/SignInResponse";
import storage from "../utils/Storage";

export function useSignIn(): (
  member: MemberToEmailRequest
) => Promise<boolean> {
  return (member: MemberToEmailRequest) => {
    return axios
      .post<SignInResponse>("http://localhost:8080/sign-in", member)
      .then((r) => {
        signIn(r.data);
        return true;
      })
      .catch((_) => false);
  };
}

export function useSignUp(): (member: SignUpRequest) => Promise<string> {
  return (member: SignUpRequest) => {
    return axios
      .post<SignInResponse>("http://localhost:8080/sign-up", member)
      .then((r) => {
        signIn(r.data);
        return;
      })
      .catch((e) => {
        if (e.response?.data?.message === "중복") {
          return e.response.data.message;
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

export function useVerifyIdentity(): (
  member: MemberToIdRequest
) => Promise<boolean> {
  return (member: MemberToIdRequest) => {
    return axios
      .post("http://localhost:8080/my/check", member)
      .then((b) => b.data);
  };
}

function signIn(res: SignInResponse) {
  storage.set("user", { id: res.id, name: res.name, email: res.email });
  axios.defaults.headers.common["Authorization"] = `Bearer ${res.token}`;
  storage.set("token", res.token);
}
