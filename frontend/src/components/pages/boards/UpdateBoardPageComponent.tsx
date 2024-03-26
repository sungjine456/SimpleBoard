import { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdate } from "../../../services/BoardService";
import styles from "../../../styles/pages/boards/Board.module.scss";
import { BoardContext } from "../../contexts/BoardContext";

interface FormData {
  title: string;
  content: string;
}

function UpdateBoardPageComponent() {
  const params = useParams();
  const update = useUpdate();
  const navigate = useNavigate();

  const { board } = useContext(BoardContext);

  const id = parseInt(params.id ?? "-1");
  const submitBtn = useRef<HTMLButtonElement>(null);
  const titleElement = useRef<HTMLInputElement | null>(null);
  const contentElement = useRef<HTMLTextAreaElement | null>(null);

  const { register, handleSubmit, trigger, getFieldState } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      title: board.title,
      content: board.content,
    },
  });

  const { ref: titleRef, ...titleRest } = register("title", {
    required: "제목을 입력해주세요.",
  });
  const { ref: contentRef, ...contentRest } = register("content", {
    required: "내용을 입력해주세요.",
  });

  const onSaveHandler = (trigger: boolean) => {
    if (trigger) {
      submitBtn.current?.click();
    } else {
      if (getFieldState("title").error) {
        titleElement.current?.classList.add(styles.error);
        alert("제목을 입력해주세요.");
      } else {
        titleElement.current?.classList.remove(styles.error);
      }

      if (getFieldState("content").error) {
        contentElement.current?.classList.add(styles.error);
        alert("내용을 입력해주세요.");
      } else {
        contentElement.current?.classList.remove(styles.error);
      }
    }
  };

  const onSubmit = (data: FormData) => {
    update(id, {
      title: data.title,
      content: data.content,
    }).then((b) => {
      if (b) {
        alert("완료했습니다.");
        navigate("/");
      } else {
        alert("다시 시도해주세요.");
      }
    });
  };

  return (
    <form className="m-auto">
      <div>
        <input
          className={styles.title}
          placeholder="제목을 입력하세요."
          {...titleRest}
          ref={(e) => {
            titleRef(e);
            titleElement.current = e;
          }}
        />
      </div>
      <div>
        <textarea
          className={styles.content}
          placeholder="내용을 입력하세요."
          maxLength={300}
          {...contentRest}
          ref={(e) => {
            contentRef(e);
            contentElement.current = e;
          }}
        ></textarea>
      </div>
      <button
        className="align-self-end"
        type="button"
        onClick={() => trigger().then((trigger) => onSaveHandler(trigger))}
      >
        수정
      </button>
      <button
        className="d-none"
        type="submit"
        ref={submitBtn}
        onClick={handleSubmit(onSubmit)}
      ></button>
    </form>
  );
}

export default UpdateBoardPageComponent;
