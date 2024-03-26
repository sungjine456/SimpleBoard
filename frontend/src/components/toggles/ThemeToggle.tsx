import { useContext, useEffect, useRef } from "react";
import styles from "../../styles/toggles/ThemeToggle.module.scss";
import { Theme, ThemeContext } from "../contexts/ThemeContext";

function ThemeToggle() {
  const { theme, toggle } = useContext(ThemeContext);

  const toggleElement = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    if (theme === Theme.DARK) {
      toggleElement.current?.classList.toggle(styles.active);
    }
    // eslint-disable-next-line
  }, []);

  const onClickHandler = () => {
    toggleElement.current?.classList.toggle(styles.active);
    toggle();
  };

  return (
    <div className={styles.body}>
      <input type="checkbox" id="toggle" hidden />
      <label
        htmlFor="toggle"
        className={styles.toggleSwitch}
        ref={toggleElement}
        onClick={onClickHandler}
      >
        <span className={styles.toggleButton}></span>
      </label>
    </div>
  );
}

export default ThemeToggle;
