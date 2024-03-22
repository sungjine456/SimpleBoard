import { renderHook } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { useFindBoard, useUpdate, useWrite } from "../../services/BoardService";
import BoardRequest from "../../models/requests/BoardRequest";

const mock = new MockAdapter(axios, { delayResponse: 200 });

const testTitle = "title";
const testContent = "content";

describe("useWrite", () => {
  const req = { title: "title", content: "content" };

  test("성공했을 때", async () => {
    mock.onPost("http://localhost:8080/board").reply(200, true);

    const { result } = renderHook(() => useWrite());

    expect(await result.current(req)).toBeTruthy();
  });

  test("실패했을 때", async () => {
    mock.onPost("http://localhost:8080/board").reply(200, false);

    const { result } = renderHook(() => useWrite());

    expect(await result.current(req)).toBeFalsy();
  });

  test("서버에서 에러가 발생했을 때", async () => {
    mock.onPost("http://localhost:8080/board").reply(500);

    const { result } = renderHook(() => useWrite());

    expect(await result.current(req)).toBeFalsy();
  });
});

describe("useUpdate", () => {
  const req = { title: "title", content: "content" };

  test("성공했을 때", async () => {
    mock.onPost("http://localhost:8080/board/1").reply(200, true);

    const { result } = renderHook(() => useUpdate());

    expect(await result.current(1, req)).toBeTruthy();
  });

  test("실패했을 때", async () => {
    mock.onPost("http://localhost:8080/board/1").reply(200, false);

    const { result } = renderHook(() => useUpdate());

    expect(await result.current(1, req)).toBeFalsy();
  });

  test("서버에서 에러가 발생했을 때", async () => {
    mock.onPost("http://localhost:8080/board/1").reply(500);

    const { result } = renderHook(() => useUpdate());

    expect(await result.current(1, req)).toBeFalsy();
  });
});

describe("useFindBoard", () => {
  const id = 1;
  const data = {
    id: id,
    memberId: 1,
    title: testTitle,
    content: testContent,
    memberName: "memberName",
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
