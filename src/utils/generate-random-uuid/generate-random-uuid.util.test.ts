import { generateRandomUUID } from "./generate-random-uuid.util";

let originalCrypto: typeof window.crypto;

beforeEach(() => {
  originalCrypto = window.crypto;
});

afterEach(() => {
  Object.defineProperty(window, "crypto", {
    value: originalCrypto,
    configurable: true,
  });
});

it("should generate unique UUIDs", () => {
  expect(generateRandomUUID()).not.toBe(generateRandomUUID());
});

it("should generate UUIDs of correct length", () => {
  expect(generateRandomUUID().length).toBe(36);
});

it("should generate UUIDs with hyphens in correct positions", () => {
  const uuid = generateRandomUUID();
  expect(uuid[8]).toBe("-");
  expect(uuid[13]).toBe("-");
  expect(uuid[18]).toBe("-");
  expect(uuid[23]).toBe("-");
});

it("should generate UUIDs matching the UUID v4 pattern", () => {
  const uuid = generateRandomUUID();
  const uuidV4Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  expect(uuid).toMatch(uuidV4Pattern);
});

it("should fallback to manual UUID generation if crypto is not available", () => {
  Object.defineProperty(window, "crypto", {
    value: undefined,
    configurable: true,
  });
  expect(generateRandomUUID()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
});

it("should fallback to manual UUID generation if crypto.randomUUID is not available", () => {
  Object.defineProperty(window, "crypto", {
    value: { ...originalCrypto, randomUUID: undefined },
    configurable: true,
  });
  expect(generateRandomUUID()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
});
