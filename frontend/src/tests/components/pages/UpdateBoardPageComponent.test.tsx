import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { act } from "react-dom/test-utils";
import * as router from "react-router";
import UpdateBoardPageComponent from "../../../components/pages/boards/UpdateBoardPageComponent";

const mock = new MockAdapter(axios);
const navigate = jest.fn();
window.alert = jest.fn();

let title: HTMLInputElement;
let content: HTMLTextAreaElement;
let button: HTMLButtonElement;

beforeEach(() => {
  jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);

  render(<UpdateBoardPageComponent />);

  title = screen.getByPlaceholderText("제목을 입력하세요.");
  content = screen.getByPlaceholderText("내용을 입력하세요.");
  button = screen.getByRole("button", {
    name: "수정",
  });
});

test("성공", async () => {
  mock.onPost("http://localhost:8080/board/1").reply(200, true);

  userEvent.type(title, "title");
  userEvent.type(content, "content");

  expect(title.classList.contains("error")).toBeFalsy();
  expect(content.classList.contains("error")).toBeFalsy();

  await act(async () => userEvent.click(button));

  expect(title.classList.contains("error")).toBeFalsy();
  expect(content.classList.contains("error")).toBeFalsy();
});

describe("실패", () => {
  test("제목이 없을 때", async () => {
    userEvent.clear(title);
    userEvent.type(content, "content");

    expect(title.classList.contains("error")).toBeFalsy();
    expect(content.classList.contains("error")).toBeFalsy();

    await act(async () => userEvent.click(button));

    expect(title.classList.contains("error")).toBeTruthy();
    expect(content.classList.contains("error")).toBeFalsy();
  });

  test("내용이 없을 때", async () => {
    userEvent.type(title, "title");
    userEvent.clear(content);

    expect(title.classList.contains("error")).toBeFalsy();
    expect(content.classList.contains("error")).toBeFalsy();

    await act(async () => userEvent.click(button));

    expect(title.classList.contains("error")).toBeFalsy();
    expect(content.classList.contains("error")).toBeTruthy();
  });
});
