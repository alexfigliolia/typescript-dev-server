# Typescript Dev Server
A lightweight development server for typescript projects. The server will watch your files and reboot on changes and allow you to boot/kill auxiliary services used by your development workflow.

## Installation
```bash
npm i -D @figliolia/typescript-dev-server
# or
yarn add -D @figliolia/typescript-dev-server
```

### Basic Usage
```typescript
import { DevServer } from "@figliolia/typescript-dev-server";

const Server = new DevServer({
  entryPoint: "src/index.ts",
});
```

### Advanced Usage
```typescript
import { DevServer } from "@figliolia/typescript-dev-server";

const Server = new DevServer({
  entryPoint: "src/index.ts",
  // An optional custom path to your tsconfig for development 
  tsconfig: "path/to/yourTsconfig.json",
  // A color for your dev server's stdout logs
  color: "magenta",
  // Environment variables to pass to your node.js runtime
  nodeOptions: {
    NODE_ENV: "development",
    NODE_OPTIONS: "--enable-source-maps"
  },
  // Auxiliary services to start with your dev server
  serviceCommands: {
    Redis: "brew services start redis",
    Postgres: "brew services start postgresql@16",
  },
  // Commands to shut down auxiliary services when your
  // server stops
  killCommands: {
    Redis: "brew services stop redis",
    Postgres: "brew services stop postgresql@16",
  }
});
```

### Running your Dev Server
To run your dev server, you can simply run `node path/to/yourDevServer.ts`. If you're writing your dev server in typescript, you can choose to compile and run it using `tsc` and `node` or opt for an all-in-one solution such as `ts-node`.