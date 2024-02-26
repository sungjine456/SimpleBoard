import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { AuthProvider } from "../../components/contexts/AuthContext";
import MemberToEmailRequest from "../../models/requests/MemberToEmailRequest";
import SignUpRequest from "../../models/requests/SignUpRequest";
import {
  useCheckEmail,
  useFindMember,
  useLeaveMember,
  useSignIn,
  useSignUp,
  useVerifyIdentity,
} from "../../services/MemberService";

const mock = new MockAdapter(axios, { delayResponse: 200 });

const testName = "name";
const testEmail = "test@abc.com";
const testPassword = "password";

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe("useSignIn", () => {
  const req: MemberToEmailRequest = {
    email: testEmail,
    password: testPassword,
  };

  test("when returned an ok", async () => {
    mock.onPost("http://localhost:8080/sign-in").reply(200, {
      name: testName,
      email: testEmail,
      token: "accessToken",
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      return <AuthProvider>{children}</AuthProvider>;
    };

    const { result } = renderHook(() => useSignIn(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current(req)).resolves.toBe(true);
      expect(axios.defaults.headers.common["Authorization"]).toBe(
        "Bearer accessToken"
      );
    });
    // TODO: storage, context의 데이터 테스트 추가
  });

  test("when returned a bad request", async () => {
    window.alert = jest.fn();

    mock
      .onPost("http://localhost:8080/sign-in")
      .reply(403, { message: "실패" });
    const { result } = renderHook(() => useSignIn());

    expect(await result.current(req)).toBe(false);
  });
});

describe("useSignUp", () => {
  const req: SignUpRequest = {
    name: testName,
    email: testEmail,
    password: testPassword,
  };

  test("when returned an ok", async () => {
    mock
      .onPost("http://localhost:8080/sign-up")
      .reply(200, { name: req.name, email: req.email, token: "accessToken" });

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      return <AuthProvider>{children}</AuthProvider>;
    };

    const { result } = renderHook(() => useSignUp(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current(req)).resolves.toBeUndefined();
      expect(axios.defaults.headers.common["Authorization"]).toBe(
        "Bearer accessToken"
      );
    });
    // TODO: storage, context의 데이터 테스트 추가
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
    name: testName,
    email: testEmail,
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

describe("useVerifyIdentity", () => {
  test("ok http method를 반환", async () => {
    mock.onPost("http://localhost:8080/my/check").reply(200, true);
    const { result } = renderHook(() => useVerifyIdentity());

    expect(await result.current({ id: 1, password: testPassword })).toBe(true);
  });
});

describe("useLeaveMember", () => {
  test("ok http method를 반환", async () => {
    mock.onPost("http://localhost:8080/my/leave").reply(200, true);
    const { result } = renderHook(() => useLeaveMember());

    expect(await result.current({ id: 1, password: testPassword })).toBe(true);
  });
});
