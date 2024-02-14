import axios from "axios";
import MemberRequest from "../models/requests/MemberRequest";
import SignInRequest from "../models/requests/SignInRequest";
import MemberResponse from "../models/responses/MemberResponse";
import SignInResponse from "../models/responses/SignInResponse";
import storage from "../utils/Storage";

export function useSignIn(): (member: SignInRequest) => Promise<boolean> {
  return (member: SignInRequest) => {
    return axios
      .post<SignInResponse>("http://localhost:8080/sign-in", member)
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

function signIn(res: SignInResponse) {
  storage.set("user", { id: res.id, name: res.name, email: res.email });
  axios.defaults.headers.common["Authorization"] = `Bearer ${res.token}`;
  storage.set("token", res.token);
}
