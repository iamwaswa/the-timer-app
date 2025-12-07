export function parseJson<TParsedJson>(
  data: unknown,
  jsonParser: (json: unknown) => TParsedJson,
  defaultValue: TParsedJson
): TParsedJson {
  if (typeof data !== "string") {
    return defaultValue;
  }

  try {
    return jsonParser(JSON.parse(data));
  } catch {
    return defaultValue;
  }
}
