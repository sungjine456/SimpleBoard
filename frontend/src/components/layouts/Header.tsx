import { Link } from "react-router-dom";
import "../../styles/header.css";
import HambergerIcon from "../icons/HambergerIcon";

function Header() {
  return (
    <header>
      <Link to={"/"}>
        <img src="images/main.jpg" alt="Simple Board" />
      </Link>
      <HambergerIcon />
    </header>
  );
}

export default Header;
