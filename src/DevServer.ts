import Chalk from "chalk";
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
    nodeOptions: {},
    killCommands: {},
    serviceCommands: {},
    color: "magentaBright",
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
      await this.stop();
    }
  }

  public async stop() {
    if (this.TSX) {
      this.TSX.kill();
      this.TSX = undefined;
      await this.killServices();
    }
  }

  private listenForKills() {
    process.on("exit", () => void this.stop());
    process.on("SIGINT", () => void this.stop());
    process.on("SIGTERM", () => void this.stop());
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
    console.log(Chalk[this.options.color].bold("Dev Server:"), ...messages);
  }
}
