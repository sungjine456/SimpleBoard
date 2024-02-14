import { useContext } from "react";
import { Navigate, Outlet, Route, Routes as Router } from "react-router-dom";
import { AuthContext } from "../components/contexts/AuthContext";
import SignUpFormComponent from "../components/forms/SignUpFormComponent";
import MainPageComponent from "../components/pages/MainPageComponent";
import MemberDetailPageComponent from "../components/pages/MemberDetailPageComponent";
import NotFoundPageComponent from "../components/pages/NotFoundPageComponent";
import MyPageComponent from "../components/pages/MyPageComponent";

const PrivateRoutes = () => {
  const { authenticated } = useContext(AuthContext);

  if (!authenticated && !localStorage.getItem("token"))
    return <Navigate to="/" replace />;

  return <Outlet />;
};

const Routes = () => {
  return (
    <Router>
      <Route path="/" element={<MainPageComponent />} />
      <Route path="/signUp" element={<SignUpFormComponent />} />
      <Route path="my" element={<MyPageComponent />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/mem/:userId" element={<MemberDetailPageComponent />} />
      </Route>
      <Route path="*" element={<NotFoundPageComponent />} />
    </Router>
  );
};

export default Routes;
