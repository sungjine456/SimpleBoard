import axios from "axios";
import MemberRequest from "../models/requests/MemberRequest";
import MemberRespons from "../models/responses/MemberRespons";

class MemberService {
  async addMember(member: MemberRequest) {
    console.log(member);

    try {
      await axios.post("http://localhost:8080/mem", member);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
    }

    return member;
  }
}

export default new MemberService();
