import { render, screen } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import App from "../../App";
import SignUpFormComponent from "../../components/forms/SignUpFormComponent";

test("App 랜더링", async () => {
  render(<App />, { wrapper: BrowserRouter });

  expect(screen.getByText(/로그인/i)).toBeInTheDocument();
});

test("존재하지 않는 페이지로 접근 시", () => {
  const badRoute = "/some/bad/route";

  render(
    <MemoryRouter initialEntries={[badRoute]}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText(/존재하지 않는 페이지입니다./i)).toBeInTheDocument();
});

test("회원가입 페이지 랜더링", () => {
  const route = "/signUp";

  render(
    <MemoryRouter initialEntries={[route]}>
      <SignUpFormComponent />
    </MemoryRouter>
  );

  expect(screen.getByText("가입하기")).toBeInTheDocument();
});
