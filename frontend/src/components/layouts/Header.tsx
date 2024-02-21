import { Link } from "react-router-dom";
import HambergerIcon from "../icons/HambergerIcon";

function Header() {
  return (
    <header>
      <Link to={"/"}>
        <img className="logo-img" src="images/main.jpg" alt="Simple Board" />
      </Link>
      <HambergerIcon />
    </header>
  );
}

export default Header;
