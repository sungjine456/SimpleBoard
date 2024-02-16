import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "../../services/AuthService";
import "../../styles/components/icons.css";
import { AuthContext } from "../contexts/AuthContext";

function HambergerIcon() {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const signOut = useSignOut();

  const { authenticated } = useContext(AuthContext);
  const icon = useRef<HTMLInputElement>(null);

  const handleMainClick = (path: string) => {
    setChecked(false);
    navigate(path);
  };

  const handleSignOutClick = (path: string) => {
    signOut();
    handleMainClick(path);
  };

  const handleBackgroundClick = () => {
    setChecked(false);
  };

  return (
    <div>
      <input
        type="checkbox"
        id="i-ham"
        ref={icon}
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      <label htmlFor="i-ham">
        <span></span>
        <span></span>
        <span></span>
      </label>
      <div id="items">
        <ul>
          <li>
            <p onClick={() => handleMainClick("/my")}>내 계정</p>
          </li>
          {authenticated && (
            <li>
              <p onClick={() => handleSignOutClick("/")}>로그아웃</p>
            </li>
          )}
        </ul>
      </div>
      <div id="background" onClick={() => handleBackgroundClick()}></div>
    </div>
  );
}

export default HambergerIcon;
