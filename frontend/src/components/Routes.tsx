import { useContext } from "react";
import { Navigate, Outlet, Route, Routes as Router } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import SignUpFormComponent from "./forms/SignUpFormComponent";
import MainPageComponent from "./pages/MainPageComponent";
import MemberDetailPageComponent from "./pages/MemberDetailPageComponent";
import NotFoundPageComponent from "./pages/NotFoundPageComponent";

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
      <Route element={<PrivateRoutes />}>
        <Route path="/mem/:userId" element={<MemberDetailPageComponent />} />
      </Route>
      <Route path="*" element={<NotFoundPageComponent />} />
    </Router>
  );
};

export default Routes;
