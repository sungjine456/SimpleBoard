import { renderHook } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { useFindBoard } from "../../services/BoardService";

const mock = new MockAdapter(axios, { delayResponse: 200 });

const testTitle = "title";
const testContent = "content";

describe("useFindBoard", () => {
  const id = 1;
  const data = {
    id: id,
    title: testTitle,
    content: testContent,
  };

  test("성공했을 때", async () => {
    mock.onGet(`http://localhost:8080/board/${id}`).reply(200, data);

    const { result } = renderHook(() => useFindBoard());

    expect(await result.current(id)).toStrictEqual(data);
  });

  test("실패했을 때", async () => {
    mock.onGet(`http://localhost:8080/board/${id}`).reply(403);

    const { result } = renderHook(() => useFindBoard());

    const d = await result.current(id);

    expect(d.id).toBe(-1);
    expect(d.title).toBe("");
    expect(d.content).toBe("");
  });
});
