import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import * as router from "react-router";
import SignInFormComponent from "../../components/forms/SignInFormComponent";
import SignUpFormComponent from "../../components/forms/SignUpFormComponent";

const mock = new MockAdapter(axios, { delayResponse: 200 });
const navigate = jest.fn();

mock.onPost("http://localhost:8080/sign-in").reply(200, "accessToken");

beforeEach(() => {
  jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
});

describe("submits form of sign-in", () => {
  test("when success", async () => {
    let isSucceed = false;

    render(<SignInFormComponent handler={(b) => (isSucceed = b)} />);

    const email = screen.getByPlaceholderText("이메일");
    const password = screen.getByPlaceholderText("비밀번호");
    const button = screen.getByRole("button", { name: "로그인" });

    userEvent.type(email, "test@abc.com");
    userEvent.type(password, "Test1234");

    userEvent.click(button);

    await screen.findByRole("button", { name: "로그인" });

    await waitFor(() => {
      expect(isSucceed).toBe(true);
      expect(axios.defaults.headers.common["Authorization"]).toBe(
        "Bearer accessToken"
      );
    });
  });

  test("when empty email", async () => {
    render(<SignInFormComponent handler={() => {}} />);

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

  test("when whrong email", async () => {
    render(<SignInFormComponent handler={() => {}} />);

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

  test("when empty password", async () => {
    render(<SignInFormComponent handler={() => {}} />);

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

  test("when short password", async () => {
    render(<SignInFormComponent handler={() => {}} />);

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

  test("when wrong email and short password", async () => {
    render(<SignInFormComponent handler={() => {}} />);

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

test("submits form of sign-up when whrong datas", async () => {
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
