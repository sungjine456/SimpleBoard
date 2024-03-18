import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function HambergerIcon() {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const { authenticated, signOut } = useContext(AuthContext);

  const icon = useRef<HTMLInputElement>(null);

  const clickHandler = (path: string) => {
    setChecked(false);
    navigate(path);
  };

  const signOutHandler = (path: string) => {
    signOut();
    clickHandler(path);
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
      <div id="ham-items">
        <ul>
          <li>
            <p onClick={() => clickHandler("/my")}>내 계정</p>
          </li>
          {authenticated && (
            <>
              <li>
                <p onClick={() => clickHandler("/board")}>글쓰기</p>
              </li>
              <li>
                <p onClick={() => signOutHandler("/")}>로그아웃</p>
              </li>
            </>
          )}
        </ul>
      </div>
      <div
        id="background"
        className="d-none"
        onClick={() => handleBackgroundClick()}
      ></div>
    </div>
  );
}

export default HambergerIcon;
