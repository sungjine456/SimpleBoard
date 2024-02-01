import axios from "axios";
import LoginRequest from "../models/requests/LoginRequest";
import MemberRequest from "../models/requests/MemberRequest";
import MemberRespons from "../models/responses/MemberRespons";

class MemberService {
  async login(member: LoginRequest): Promise<Boolean> {
    try {
      const response = await axios.post<Boolean>(
        "http://localhost:8080/login",
        member
      );

      return response.data;
    } catch (e) {
      return false;
    }
  }

  async addMember(member: MemberRequest) {
    console.log(member);

    try {
      await axios.post("http://localhost:8080/mem", member);
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

export default new MemberService();
