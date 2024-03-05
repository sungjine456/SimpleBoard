import { render, screen } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import App from "../../App";
import { AuthContext } from "../../components/contexts/AuthContext";
import SignUpFormComponent from "../../components/forms/SignUpFormComponent";
import SignInResponse from "../../models/responses/SignInResponse";
import Routes from "../../routes/Routes";

test("App 랜더링", async () => {
  render(<App />, { wrapper: BrowserRouter });

  expect(screen.getByText("로그인")).toBeInTheDocument();
});

test("존재하지 않는 페이지로 접근 시", () => {
  const badRoute = "/some/bad/route";

  render(
    <MemoryRouter initialEntries={[badRoute]}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText("존재하지 않는 페이지입니다.")).toBeInTheDocument();
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

describe("로그인 후 접근할 수 있는 페이지 랜더링", () => {
  test("로그인된 경우", async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            token: "token",
            member: { id: -1, name: "-", email: "-" },
            authenticated: true,
            signIn: (_: SignInResponse) => {},
            signOut: () => {},
            setToken: (_: string) => {},
            updateMember: (_: string) => {},
          }}
        >
          <Routes />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.queryByText("로그인")).toBeNull();
    expect(screen.getByText("현재 작성된 글이 없습니다.")).toBeInTheDocument();
  });

  test("로그인되지 않은 경우", async () => {
    render(
      <MemoryRouter>
        <Routes />
      </MemoryRouter>
    );

    expect(screen.queryByText("로그아웃")).toBeNull();
    expect(screen.getByText("로그인")).toBeInTheDocument();
  });
});
