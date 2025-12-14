import { act, renderHook } from "@testing-library/react";

import { useGetItemHeight } from "./get-item-height.hook";

beforeEach(() => {
  document.body.innerHTML = "";
});

it("should return the height of the preceding element", () => {
  const parentElement = document.createElement("div");
  parentElement.id = "parent-element-id-1";
  parentElement.className = "MuiGrid-container";

  const child1 = document.createElement("div");
  child1.className = "MuiGrid-root";
  const paper1 = document.createElement("div");
  paper1.className = "MuiPaper-root";
  child1.appendChild(paper1);

  const child2 = document.createElement("div");
  child2.className = "MuiGrid-root";
  const paper2 = document.createElement("div");
  paper2.className = "MuiPaper-root";
  child2.appendChild(paper2);

  const height = 100;
  Object.defineProperty(paper2, "getBoundingClientRect", {
    value: () => ({ height }),
  });

  const child3 = document.createElement("div");
  child3.className = "MuiGrid-root";

  parentElement.appendChild(child1);
  parentElement.appendChild(child2);
  parentElement.appendChild(child3);
  document.body.appendChild(parentElement);

  const { result } = renderHook(() => useGetItemHeight(parentElement.id));

  expect(result.current).toBe(height);
});

it("should return undefined if the element is not found", () => {
  const { result } = renderHook(() => useGetItemHeight("non-existent-id"));

  expect(result.current).toBeUndefined();
});

it("should update the height on window resize", () => {
  const parentElement = document.createElement("div");
  parentElement.id = "parent-element-id-2";
  parentElement.className = "MuiGrid-container";

  const child1 = document.createElement("div");
  child1.className = "MuiGrid-root";
  const paper1 = document.createElement("div");
  paper1.className = "MuiPaper-root";
  child1.appendChild(paper1);

  const child2 = document.createElement("div");
  child2.className = "MuiGrid-root";
  const paper2 = document.createElement("div");
  paper2.className = "MuiPaper-root";
  child2.appendChild(paper2);

  let height = 100;
  Object.defineProperty(paper2, "getBoundingClientRect", {
    configurable: true,
    value: () => ({ height }),
  });

  const child3 = document.createElement("div");
  child3.className = "MuiGrid-root";

  parentElement.appendChild(child1);
  parentElement.appendChild(child2);
  parentElement.appendChild(child3);
  document.body.appendChild(parentElement);

  const { result } = renderHook(() => useGetItemHeight(parentElement.id));

  expect(result.current).toBe(height);

  height = 200;
  act(() => {
    window.dispatchEvent(new Event("resize"));
  });

  expect(result.current).toBe(height);
});
