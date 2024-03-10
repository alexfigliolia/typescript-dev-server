import chalk from "chalk";
import type { ChildProcess as CP } from "child_process";
import process from "process";
import type { IOptions } from "types";
import { ChildProcess } from "@figliolia/child-process";

export class DevServer {
  private TSX?: CP;
  options: Required<IOptions>;
  constructor(options: IOptions) {
    this.options = Object.assign({}, DevServer.defaults, options);
  }

  private static readonly defaults = {
    color: "magentaBright",
    nodeOptions: {},
    killCommands: {},
    serviceCommands: {},
    tsconfig: "./tsconfig.json",
  };

  public async run() {
    this.log("Booting up...");
    try {
      this.listenForKills();
      await this.bootServices();
      const { tsconfig, entryPoint, nodeOptions } = this.options;
      const { handler, process: CP } = new ChildProcess(
        `tsx watch --clear-screen=false --tsconfig ${tsconfig} ${entryPoint}`,
        {
          stdio: "inherit",
          env: {
            ...process.env,
            ...nodeOptions,
          },
        },
      );
      this.TSX = CP;
      return handler;
    } catch (error) {
      await this.killAll();
    }
  }

  private async killAll() {
    if (this.TSX) {
      this.TSX.kill();
      this.TSX = undefined;
      await this.killServices();
    }
  }

  private listenForKills() {
    process.on("exit", () => void this.killAll());
    process.on("SIGINT", () => void this.killAll());
    process.on("SIGTERM", () => void this.killAll());
  }

  private async bootServices() {
    this.logServiceAction("Booting");
    return Promise.all(this.services.map(c => new ChildProcess(c).handler));
  }

  private killServices() {
    this.logServiceAction("Killing");
    return Promise.all(this.kills.map(c => ChildProcess.execute(c)));
  }

  private get services() {
    return Object.values(this.options.serviceCommands);
  }

  private get kills() {
    return Object.values(this.options.killCommands);
  }

  private logServiceAction(action: string) {
    this.log(
      `${action} ${Object.keys(this.options.serviceCommands).join(", ")}`,
    );
  }

  private log(...messages: string[]) {
    console.log(chalk[this.options.color].bold("Dev Server:"), ...messages);
  }
}
