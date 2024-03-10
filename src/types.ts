export interface IOptions {
  entryPoint: string;
  color?: Color;
  tsconfig?: string;
  nodeOptions?: Record<string, string>;
  serviceCommands?: Record<string, string>;
  killCommands?: Record<string, string>;
}

type Color =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "gray"
  | "grey"
  | "blackBright"
  | "redBright"
  | "greenBright"
  | "yellowBright"
  | "blueBright"
  | "magentaBright"
  | "cyanBright"
  | "whiteBright";
