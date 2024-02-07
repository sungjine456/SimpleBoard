import axios from "axios";
import MemberRequest from "../models/requests/MemberRequest";
import LoginRequest from "../models/requests/SignInRequest";
import MemberRespons from "../models/responses/MemberRespons";

class MemberService {
  async signIn(member: LoginRequest): Promise<boolean> {
    return axios
      .post("http://localhost:8080/sign-in", member)
      .then((res) => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data}`;

        localStorage.setItem("token", res.data);

        return true;
      })
      .catch((_) => {
        return false;
      });
  }

  async signUp(member: MemberRequest) {
    try {
      await axios.post("http://localhost:8080/sign-up", member);
    } catch (e) {
      console.error(e);
    }
  }

  async findMember(): Promise<MemberRespons> {
    let member: MemberRespons | PromiseLike<MemberRespons> = {
      id: -1,
      name: "-",
      email: "-",
    };

    try {
      const response = await axios.get<MemberRespons>(
        "http://localhost:8080/mem/1"
      );

      member = response.data;
    } catch (e) {
      console.error(e);
    }

    return member;
  }
}

const service = new MemberService();

export default service;
