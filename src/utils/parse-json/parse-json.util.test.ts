import { parseJson } from "./parse-json.util";

it("should return the parsed and validated object for a valid JSON string", () => {
  const data = { id: 1, name: "John Doe" };
  expect(parseJson(JSON.stringify(data), (json) => json, { id: 0, name: "default" })).toEqual(data);
});

it("should return the default value if data is not a string", () => {
  const defaultValue = { id: 0, name: "default" };
  expect(parseJson(null, vi.fn(), defaultValue)).toEqual(defaultValue);
  expect(parseJson(undefined, vi.fn(), defaultValue)).toEqual(defaultValue);
  expect(parseJson(12345, vi.fn(), defaultValue)).toEqual(defaultValue);
  expect(parseJson({ a: 1 }, vi.fn(), defaultValue)).toEqual(defaultValue);
  expect(parseJson(["a", "b"], vi.fn(), defaultValue)).toEqual(defaultValue);
});

it("should return the default value if data is an invalid JSON string", () => {
  const defaultValue = { id: 0, name: "default" };
  // Missing closing brace
  expect(parseJson('{"id": 1, "name": "John Doe"', (json) => json, defaultValue)).toEqual(defaultValue);
});

it("should return the default value if the json parser throws an error", () => {
  const defaultValue = { id: 0, name: "default" };
  expect(
    parseJson(
      JSON.stringify({ foo: "bar" }),
      () => {
        throw new Error();
      },
      defaultValue,
    ),
  ).toEqual(defaultValue);
});

it("should call the jsonParser with the parsed object", () => {
  const defaultValue = { id: 0, name: "default" };
  const data = { id: 2, name: "Jane Doe" };
  const parserSpy = vi.fn().mockReturnValue(data);
  parseJson(JSON.stringify(data), parserSpy, defaultValue);
  expect(parserSpy).toHaveBeenCalledOnce();
  expect(parserSpy).toHaveBeenCalledWith(data);
  expect(parserSpy).toHaveReturnedWith(data);
});
