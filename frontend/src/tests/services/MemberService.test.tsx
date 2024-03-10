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
import storage from "../../utils/Storage";

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

  test("성공했을 때", async () => {
    const testToken = "accessToken";

    mock.onPost("http://localhost:8080/sign-in").reply(200, {
      name: testName,
      email: testEmail,
      token: testToken,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => {
      return <AuthProvider>{children}</AuthProvider>;
    };

    expect(storage.get("token")).toBeNull();

    const { result } = renderHook(() => useSignIn(), {
      wrapper: wrapper,
    });

    await waitFor(() => {
      expect(result.current(req)).resolves.toBe(true);
      expect(storage.get("token")).toBe(testToken);
      expect(axios.defaults.headers.common["Authorization"]).toBe(
        `Bearer ${testToken}`
      );
    });
    // TODO: context의 데이터 테스트 추가
  });

  test("실패했을 때", async () => {
    window.alert = jest.fn();

    mock
      .onPost("http://localhost:8080/sign-in")
      .reply(403, { message: "실패" });

    const { result } = renderHook(() => useSignIn());

    await waitFor(() => {
      expect(result.current(req)).resolves.toBe(false);
      expect(storage.get("token")).toBeNull();
    });
  });
});

describe("useSignUp", () => {
  const req: SignUpRequest = {
    name: testName,
    email: testEmail,
    password: testPassword,
  };

  test("성공했을 때", async () => {
    mock
      .onPost("http://localhost:8080/sign-up")
      .reply(200, { name: req.name, email: req.email, token: "accessToken" });

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      return <AuthProvider>{children}</AuthProvider>;
    };

    expect(storage.get("token")).toBeNull();

    const { result } = renderHook(() => useSignUp(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current(req)).resolves.toBeUndefined();
      expect(storage.get("token")).not.toBeNull();
      expect(axios.defaults.headers.common["Authorization"]).toBe(
        "Bearer accessToken"
      );
    });
    // TODO: context의 데이터 테스트 추가
  });

  test("중복됐을 때", async () => {
    mock
      .onPost("http://localhost:8080/sign-up")
      .reply(400, { message: "중복" });

    const { result } = renderHook(() => useSignUp());

    await waitFor(() => {
      expect(result.current(req)).resolves.toBe("중복");
      expect(storage.get("token")).toBeNull();
    });
  });

  test("실패했을 때", async () => {
    mock
      .onPost("http://localhost:8080/sign-up")
      .reply(400, { message: "실패" });

    const { result } = renderHook(() => useSignUp());

    await waitFor(() => {
      expect(result.current(req)).resolves.toBe("실패");
      expect(storage.get("token")).toBeNull();
    });
  });
});

describe("useFindMember", () => {
  const id = 1;

  test("성공했을 때", async () => {
    const data = {
      name: testName,
      email: testEmail,
      message: "msg",
    };

    mock.onGet(`http://localhost:8080/mem/${id}`).reply(200, data);

    const { result } = renderHook(() => useFindMember());

    expect(await result.current(id)).toStrictEqual(data);
  });

  test("실패했을 때", async () => {
    mock.onGet(`http://localhost:8080/mem/${id}`).reply(403);

    const { result } = renderHook(() => useFindMember());

    const member = await result.current(id);

    expect(member.name).toBe("-");
    expect(member.email).toBe("-");
    expect(member.message).toBe("");
  });
});

describe("useCheckEmail", () => {
  test("성공했을 때", async () => {
    mock.onPost("http://localhost:8080/checkEmail").reply(200, true);

    const { result } = renderHook(() => useCheckEmail());

    expect(await result.current("email")).toBe(true);
  });
});

describe("useVerifyIdentity", () => {
  test("성공했을 때", async () => {
    mock.onPost("http://localhost:8080/my/check").reply(200, true);

    const { result } = renderHook(() => useVerifyIdentity());

    expect(await result.current(testPassword)).toBe(true);
  });
});

describe("useLeaveMember", () => {
  test("성공했을 때", async () => {
    mock.onPost("http://localhost:8080/my/leave").reply(200, true);

    const { result } = renderHook(() => useLeaveMember());

    expect(await result.current(testPassword)).toBe(true);
  });
});
