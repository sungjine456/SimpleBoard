import { Link } from "react-router-dom";
import HambergerIcon from "../icons/HambergerIcon";
import ThemeToggle from "../toggles/ThemeToggle";

function Header() {
  return (
    <header>
      <Link to={"/"}>
        <img className="logo-img" src="images/main.jpg" alt="Simple Board" />
      </Link>
      <div className="d-flex">
        <ThemeToggle />
        <HambergerIcon />
      </div>
    </header>
  );
}

export default Header;
