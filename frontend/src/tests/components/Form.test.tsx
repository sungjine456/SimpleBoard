import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import * as router from "react-router";
import { AuthProvider } from "../../components/contexts/AuthContext";
import SignInFormComponent from "../../components/forms/SignInFormComponent";
import SignUpFormComponent from "../../components/forms/SignUpFormComponent";

const mock = new MockAdapter(axios, { delayResponse: 200 });
const navigate = jest.fn();

beforeEach(() => {
  jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
});

describe("SignInFormComponent", () => {
  test("성공했을 때", async () => {
    const emailData = "test@abc.com";

    mock
      .onPost("http://localhost:8080/sign-in")
      .reply(200, { token: "accessToken" });

    render(
      <AuthProvider>
        <SignInFormComponent />
      </AuthProvider>
    );

    const email = screen.getByPlaceholderText("이메일");
    const password = screen.getByPlaceholderText("비밀번호");
    const button = screen.getByRole("button", { name: "로그인" });

    userEvent.type(email, emailData);
    userEvent.type(password, "Test1234");

    userEvent.click(button);

    await screen.findByRole("button", { name: "로그인" });

    await waitFor(() => {
      expect(axios.defaults.headers.common["Authorization"]).toBe(
        "Bearer accessToken"
      );
    });
  });

  test("이메일을 적지 않았을 때", async () => {
    render(<SignInFormComponent />);

    const email = screen.getByPlaceholderText("이메일");
    const password = screen.getByPlaceholderText("비밀번호");
    const button = screen.getByRole("button", { name: "로그인" });

    userEvent.clear(email);
    userEvent.type(password, "Test1234");

    userEvent.click(button);

    await screen.findByRole("alert");
    await screen.findByPlaceholderText("이메일");
    await screen.findByPlaceholderText("비밀번호");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "이메일을 입력해주세요."
    );
    expect(screen.getByPlaceholderText("이메일")).toHaveValue("");
    expect(screen.getByPlaceholderText("비밀번호")).toHaveValue("Test1234");
  });

  test("잘못된 형식의 이메일을 적었을 때", async () => {
    render(<SignInFormComponent />);

    const email = screen.getByPlaceholderText("이메일");
    const password = screen.getByPlaceholderText("비밀번호");
    const button = screen.getByRole("button", { name: "로그인" });

    userEvent.type(email, "test");
    userEvent.type(password, "Test1234");

    userEvent.click(button);

    await screen.findByRole("alert");
    await screen.findByPlaceholderText("이메일");
    await screen.findByPlaceholderText("비밀번호");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "이메일 형식에 맞지 않습니다."
    );
    expect(screen.getByPlaceholderText("이메일")).toHaveValue("test");
    expect(screen.getByPlaceholderText("비밀번호")).toHaveValue("Test1234");
  });

  test("비밀번호를 적지 않았을 때", async () => {
    render(<SignInFormComponent />);

    const email = screen.getByPlaceholderText("이메일");
    const password = screen.getByPlaceholderText("비밀번호");
    const button = screen.getByRole("button", { name: "로그인" });

    userEvent.type(email, "test@abc.com");
    userEvent.clear(password);

    userEvent.click(button);

    await screen.findByRole("alert");
    await screen.findByPlaceholderText("이메일");
    await screen.findByPlaceholderText("비밀번호");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "비밀번호를 입력해주세요."
    );
    expect(screen.getByPlaceholderText("이메일")).toHaveValue("test@abc.com");
    expect(screen.getByPlaceholderText("비밀번호")).toHaveValue("");
  });

  test("비밀번호가 짧을 때", async () => {
    render(<SignInFormComponent />);

    const email = screen.getByPlaceholderText("이메일");
    const password = screen.getByPlaceholderText("비밀번호");
    const button = screen.getByRole("button", { name: "로그인" });

    userEvent.type(email, "test@abc.com");
    userEvent.type(password, "test");

    userEvent.click(button);

    await screen.findByRole("alert");
    await screen.findByPlaceholderText("이메일");
    await screen.findByPlaceholderText("비밀번호");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "8자리 이상 비밀번호를 사용하세요."
    );
    expect(screen.getByPlaceholderText("이메일")).toHaveValue("test@abc.com");
    expect(screen.getByPlaceholderText("비밀번호")).toHaveValue("test");
  });

  test("잘못된 형식의 이메일과 비밀번호를 짧게 적었을 때", async () => {
    render(<SignInFormComponent />);

    const email = screen.getByPlaceholderText("이메일");
    const password = screen.getByPlaceholderText("비밀번호");
    const button = screen.getByRole("button", { name: "로그인" });

    userEvent.type(email, "test@abc");
    userEvent.type(password, "test");

    userEvent.click(button);

    await screen.findAllByRole("alert");
    await screen.findByPlaceholderText("이메일");
    await screen.findByPlaceholderText("비밀번호");

    expect(screen.getAllByRole("alert")).toHaveLength(2);
    expect(screen.getByPlaceholderText("이메일")).toHaveValue("test@abc");
    expect(screen.getByPlaceholderText("비밀번호")).toHaveValue("test");
  });
});
describe("SignUpFormComponent", () => {
  test("잘못된 데이터를 입력했을 때", async () => {
    render(<SignUpFormComponent />);

    const name = screen.getByPlaceholderText("이름");
    const email = screen.getByPlaceholderText("이메일");
    const password = screen.getByPlaceholderText("비밀번호");
    const passwordCheck = screen.getByPlaceholderText("비밀번호 확인");
    const button = screen.getByRole("button", { name: "가입하기" });

    userEvent.clear(name);
    userEvent.type(email, "test@abc");
    userEvent.type(password, "test");
    userEvent.clear(passwordCheck);

    userEvent.click(button);

    await screen.findAllByRole("alert");
    await screen.findByPlaceholderText("이메일");
    await screen.findByPlaceholderText("비밀번호");

    expect(screen.getAllByRole("alert")).toHaveLength(4);
    expect(screen.getByPlaceholderText("이메일")).toHaveValue("test@abc");
    expect(screen.getByPlaceholderText("비밀번호")).toHaveValue("test");
  });
});
