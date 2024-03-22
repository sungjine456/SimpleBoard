import { useContext } from "react";
import { Navigate, Outlet, Route, Routes as Router } from "react-router-dom";
import { AuthContext } from "../components/contexts/AuthContext";
import SignUpFormComponent from "../components/forms/SignUpFormComponent";
import BoardsComponent from "../components/pages/BoardsComponent";
import MainPageComponent from "../components/pages/MainPageComponent";
import MemberDetailPageComponent from "../components/pages/MemberDetailPageComponent";
import NotFoundPageComponent from "../components/pages/NotFoundPageComponent";
import PasswordCheckComponent from "../components/pages/PasswordCheckComponent";
import BoardDetailPageComponent from "../components/pages/boards/BoardDetailPageComponent";
import BoardPageComponent from "../components/pages/boards/BoardPageComponent";
import UpdateBoardPageComponent from "../components/pages/boards/UpdateBoardPageComponent";
import MyPageComponent from "../components/pages/my/MyPageComponent";

const PrivateRoutes = () => {
  const { token, authenticated } = useContext(AuthContext);

  if (!authenticated || !token) return <Navigate to="/" replace />;

  return <Outlet />;
};

const Routes = () => {
  return (
    <Router>
      <Route path="/" element={<MainPageComponent />} />
      <Route path="/signUp" element={<SignUpFormComponent />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/mem/:userId" element={<MemberDetailPageComponent />} />
        <Route path="/my" element={<MyPageComponent />} />
        <Route path="/my/check" element={<PasswordCheckComponent />} />
        <Route path="/board" element={<BoardPageComponent />} />
        <Route path="/board/:id" element={<BoardDetailPageComponent />} />
        <Route
          path="/board/:id/update"
          element={<UpdateBoardPageComponent />}
        />
        <Route path="/boards" element={<BoardsComponent />} />
      </Route>
      <Route path="*" element={<NotFoundPageComponent />} />
    </Router>
  );
};

export default Routes;
