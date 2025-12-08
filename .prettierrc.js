module.exports = {
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "<THIRD_PARTY_MODULES>", // Third-party libraries
    "^@/(.*)$", // src imports
    "^[./]", // Relative imports
  ],
  importOrderSeparation: true, // Add a new line between import groups
  importOrderSortSpecifiers: true, // Sort imports within each import statement
  printWidth: 120, // Set maximum line width to 120 characters
};
