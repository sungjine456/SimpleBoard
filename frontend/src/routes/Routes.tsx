import { useContext } from "react";
import { Navigate, Outlet, Route, Routes as Router } from "react-router-dom";
import { AuthContext } from "../components/contexts/AuthContext";
import SignUpFormComponent from "../components/forms/SignUpFormComponent";
import MainPageComponent from "../components/pages/MainPageComponent";
import MemberDetailPageComponent from "../components/pages/MemberDetailPageComponent";
import MyPageComponent from "../components/pages/MyPageComponent";
import NotFoundPageComponent from "../components/pages/NotFoundPageComponent";
import PasswordCheckComponent from "../components/pages/PasswordCheckComponent";

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
      </Route>
      <Route path="*" element={<NotFoundPageComponent />} />
    </Router>
  );
};

export default Routes;
