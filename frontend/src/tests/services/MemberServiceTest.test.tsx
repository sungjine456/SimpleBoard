import { renderHook } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  useCheckEmail,
  useFindMember,
  useSignIn,
  useSignUp,
} from "../../services/MemberService";
import SignInRequest from "../../models/requests/SignInRequest";
import MemberRequest from "../../models/requests/MemberRequest";

const mock = new MockAdapter(axios, { delayResponse: 200 });

describe("useSignIn", () => {
  const req: SignInRequest = { email: "test@abc.com", password: "password" };

  test("when returned an ok", async () => {
    mock.onPost("http://localhost:8080/sign-in").reply(200, "accessToken");
    const { result } = renderHook(() => useSignIn());

    expect(await result.current(req)).toBe(true);
  });

  test("when returned a bad request", async () => {
    mock.onPost("http://localhost:8080/sign-in").reply(403);
    const { result } = renderHook(() => useSignIn());

    expect(await result.current(req)).toBe(false);
  });
});

describe("useSignUp", () => {
  const req: MemberRequest = {
    name: "name",
    email: "test@abc.com",
    password: "password",
  };

  test("when returned an ok", async () => {
    mock
      .onPost("http://localhost:8080/sign-up")
      .reply(200, { name: req.name, email: req.email });
    const { result } = renderHook(() => useSignUp());

    expect(await result.current(req)).toBeUndefined();
  });

  test("when returned a bad request with 중복", async () => {
    mock
      .onPost("http://localhost:8080/sign-up")
      .reply(400, { message: "중복" });
    const { result } = renderHook(() => useSignUp());

    expect(await result.current(req)).toBe("중복");
  });

  test("when returned a failure", async () => {
    mock
      .onPost("http://localhost:8080/sign-up")
      .reply(400, { message: "실패" });
    const { result } = renderHook(() => useSignUp());

    expect(await result.current(req)).toBe("실패");
  });
});

describe("useFindMember", () => {
  const id = 1;
  const data = {
    id: id,
    name: "name",
    email: "test@abc.com",
    message: "msg",
  };

  test("when returned an ok", async () => {
    mock.onGet(`http://localhost:8080/mem/${id}`).reply(200, data);
    const { result } = renderHook(() => useFindMember());

    expect(await result.current(id)).toStrictEqual(data);
  });

  test("when returned a bad request", async () => {
    mock.onGet(`http://localhost:8080/mem/${id}`).reply(403);
    const { result } = renderHook(() => useFindMember());

    const d = await result.current(id);

    expect(d.id).toBe(-1);
    expect(d.name).toBe("-");
    expect(d.email).toBe("-");
    expect(d.message).toBe("");
  });
});

describe("useCheckEmail", () => {
  test("when returned an ok", async () => {
    mock.onPost("http://localhost:8080/checkEmail").reply(200, true);
    const { result } = renderHook(() => useCheckEmail());

    expect(await result.current("email")).toBe(true);
  });
});
