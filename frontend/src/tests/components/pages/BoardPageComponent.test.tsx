import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { act } from "react-dom/test-utils";
import * as router from "react-router";
import { AuthProvider } from "../../../components/contexts/AuthContext";
import BoardPageComponent from "../../../components/pages/BoardPageComponent";

const mock = new MockAdapter(axios, { delayResponse: 200 });
const navigate = jest.fn();
window.alert = jest.fn();

beforeEach(() => {
  jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
});

test("성공", async () => {
  mock.onPost("http://localhost:8080/board").reply(200, true);

  render(<BoardPageComponent />);

  const title = screen.getByPlaceholderText("제목을 입력하세요.");
  const content = screen.getByPlaceholderText("내용을 입력하세요.");
  const button = screen.getByRole("button", {
    name: "저장",
  });

  userEvent.type(title, "title");
  userEvent.type(content, "content");

  await act(async () => userEvent.click(button));

  await waitFor(() => {
    expect(title.classList.length).toBe(1);
    expect(content.classList.length).toBe(1);
  });
});

describe("실패", () => {
  test("제목이 없을 때", async () => {
    render(<BoardPageComponent />);

    const title = screen.getByPlaceholderText("제목을 입력하세요.");
    const content = screen.getByPlaceholderText("내용을 입력하세요.");
    const button = screen.getByRole("button", {
      name: "저장",
    });

    userEvent.clear(title);
    userEvent.type(content, "content");

    await act(async () => userEvent.click(button));

    await waitFor(() => {
      expect(title.classList.length).toBe(2);
      expect(content.classList.length).toBe(1);
    });
  });

  test("내용이 없을 때", async () => {
    render(<BoardPageComponent />);

    const title = screen.getByPlaceholderText("제목을 입력하세요.");
    const content = screen.getByPlaceholderText("내용을 입력하세요.");
    const button = screen.getByRole("button", {
      name: "저장",
    });

    userEvent.type(title, "title");
    userEvent.clear(content);

    await act(async () => userEvent.click(button));

    await waitFor(() => {
      expect(title.classList.length).toBe(1);
      expect(content.classList.length).toBe(2);
    });
  });
});
