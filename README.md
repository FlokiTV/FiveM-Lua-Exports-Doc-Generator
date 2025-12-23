# FiveM Lua Exports Doc Generator

A simple tool to scan a FiveM resources directory for `.lua` files, extract `exports(...)` definitions, and generate a markdown report (`exports.md`) listing all found exports with their locations.

To install dependencies:

```bash
bun install
```

## Settings

Before running the script, you need to configure the target directory where the `.lua` files are located.

1. Open `index.ts`.
2. Locate the `dir` variable at the top of the file:
   ```typescript
   // Folder to search for .lua files
   const dir = `D:/fivem/resources`;
   ```
3. Change the path to your desired directory.

## Running

To run the script:

```bash
bun run index.ts
```

This will generate an `exports.md` file containing all the found exports.

This project was created using `bun init` in bun v1.3.0. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
