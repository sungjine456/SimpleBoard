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

  async signUp(member: MemberRequest): Promise<MemberRespons> {
    return axios
      .post("http://localhost:8080/sign-up", member)
      .then((body) => body.data);
  }

  async findMember(id: number): Promise<MemberRespons> {
    let member: MemberRespons | PromiseLike<MemberRespons> = {
      id: -1,
      name: "-",
      email: "-",
      message: "",
    };

    try {
      const response = await axios.get<MemberRespons>(
        `http://localhost:8080/mem/${id}`
      );

      member = response.data;
    } catch (e) {
      console.error(e);
    }

    return member;
  }

  async checkEmail(email: string): Promise<boolean> {
    return axios
      .post("http://localhost:8080/checkEmail", { email: email })
      .then((body) => body.data);
  }
}

const service = new MemberService();

export default service;
