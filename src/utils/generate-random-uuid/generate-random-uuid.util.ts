export function generateRandomUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Generate a random UUID (version 4) following these constraints:
  // 1. Format
  //    - It must be a 32-digit hexadecimal number
  //      displayed in five groups separated by hyphens,
  //      in the pattern 8-4-4-4-12. For example: f81d4fae-7dec-41d5-9158-0000c2e7d770.
  //
  // 2. Version
  //    - The 13th digit (the first digit of the third group) must be 4.
  //      This identifies the UUID as being "version 4".
  //      xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  //
  // 3. Variant
  //    - The 17th digit (the first digit of the fourth group) must be one of 8, 9, A, or B.
  //      This identifies the UUID variant as conforming to the RFC 4122 standard.
  //      xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx (where y is 8, 9, A, or B)
  //
  // 4. Randomness
  //    - All other 30 digits are generated randomly.
  //      Ideally, they should be produced by a cryptographically secure random number generator.
  //      (This is the part we are not guaranteeing with this implementation)
  //
  // This is a simple implementation and may not cover all edge cases
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (character) {
    const randomHexDigit = (Math.random() * 16) | 0;
    if (character === "x") {
      return randomHexDigit.toString(16);
    }
    const randomHexDigit0to3Inclusive = randomHexDigit & 0x3;
    const randomHexDigit8to11Inclusive = randomHexDigit0to3Inclusive | 0x8;
    return randomHexDigit8to11Inclusive.toString(16);
  });
}
