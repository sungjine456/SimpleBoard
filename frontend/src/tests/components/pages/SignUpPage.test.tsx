import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { act } from "react-dom/test-utils";
import * as router from "react-router";
import SignUpPageComponent from "../../../components/pages/SignUpPageComponent";
import { AuthProvider } from "../../../components/contexts/AuthContext";

const mock = new MockAdapter(axios);
const navigate = jest.fn();

let name: HTMLInputElement;
let email: HTMLInputElement;
let password: HTMLInputElement;
let passwordCheck: HTMLInputElement;
let button: HTMLButtonElement;

beforeEach(() => {
  jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);

  render(
    <AuthProvider>
      <SignUpPageComponent />
    </AuthProvider>
  );

  name = screen.getByPlaceholderText("이름");
  email = screen.getByPlaceholderText("이메일");
  password = screen.getByPlaceholderText("비밀번호");
  passwordCheck = screen.getByPlaceholderText("비밀번호 확인");
  button = screen.getByRole("button", { name: "가입하기" });
});

test("성공했을 때", async () => {
  mock.onPost("http://localhost:8080/checkEmail").reply(200, false);
  mock.onPost("http://localhost:8080/sign-up").reply(200, {
    token: "accessToken",
  });

  userEvent.type(name, "test");
  userEvent.type(email, "test@abc.com");
  userEvent.type(password, "Test1234");
  userEvent.type(passwordCheck, "Test1234");

  await act(async () => userEvent.click(button));

  expect(screen.queryAllByRole("alert")).toHaveLength(0);
  expect(axios.defaults.headers.common["Authorization"]).toBe(
    "Bearer accessToken"
  );
});

test("잘못된 데이터를 입력했을 때", async () => {
  userEvent.clear(name);
  userEvent.type(email, "test@abc");
  userEvent.type(password, "test");
  userEvent.clear(passwordCheck);

  await act(async () => userEvent.click(button));

  expect(screen.getAllByRole("alert")).toHaveLength(4);
  expect(email).toHaveValue("test@abc");
  expect(password).toHaveValue("test");
  expect(passwordCheck).toHaveValue("");
});
