import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { act } from "react-dom/test-utils";
import * as router from "react-router";
import { AuthProvider } from "../../../components/contexts/AuthContext";
import SignInPageComponent from "../../../components/pages/SignInPageComponent";

const mock = new MockAdapter(axios);
const navigate = jest.fn();

let email: HTMLInputElement;
let password: HTMLInputElement;
let button: HTMLButtonElement;

beforeEach(() => {
  jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);

  render(
    <AuthProvider>
      <SignInPageComponent />
    </AuthProvider>
  );

  email = screen.getByPlaceholderText("이메일");
  password = screen.getByPlaceholderText("비밀번호");
  button = screen.getByRole("button", { name: "로그인" });
});

test("로그인에 성공했을 때", async () => {
  mock
    .onPost("http://localhost:8080/sign-in")
    .reply(200, { token: "accessToken" });

  userEvent.type(email, "test@abc.com");
  userEvent.type(password, "Test1234");

  await act(async () => userEvent.click(button));

  expect(screen.queryAllByRole("alert")).toHaveLength(0);
  expect(axios.defaults.headers.common["Authorization"]).toBe(
    "Bearer accessToken"
  );
});

describe("로그인에 실패", () => {
  test("이메일을 적지 않았을 때", async () => {
    userEvent.clear(email);
    userEvent.type(password, "Test1234");

    await act(async () => userEvent.click(button));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "이메일을 입력해주세요."
    );
    expect(email).toHaveValue("");
    expect(password).toHaveValue("Test1234");
  });

  test("잘못된 형식의 이메일을 적었을 때", async () => {
    userEvent.type(email, "test");
    userEvent.type(password, "Test1234");

    await act(async () => userEvent.click(button));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "이메일 형식에 맞지 않습니다."
    );
    expect(email).toHaveValue("test");
    expect(password).toHaveValue("Test1234");
  });

  test("비밀번호를 적지 않았을 때", async () => {
    userEvent.type(email, "test@abc.com");
    userEvent.clear(password);

    await act(async () => userEvent.click(button));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "비밀번호를 입력해주세요."
    );
    expect(email).toHaveValue("test@abc.com");
    expect(password).toHaveValue("");
  });

  test("비밀번호가 짧을 때", async () => {
    userEvent.type(email, "test@abc.com");
    userEvent.type(password, "test");

    await act(async () => userEvent.click(button));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "8자리 이상 비밀번호를 사용하세요."
    );
    expect(email).toHaveValue("test@abc.com");
    expect(password).toHaveValue("test");
  });

  test("잘못된 형식의 이메일과 비밀번호를 짧게 적었을 때", async () => {
    userEvent.type(email, "test@abc");
    userEvent.type(password, "test");

    await act(async () => userEvent.click(button));

    expect(screen.getAllByRole("alert")).toHaveLength(2);
    expect(email).toHaveValue("test@abc");
    expect(password).toHaveValue("test");
  });
});
