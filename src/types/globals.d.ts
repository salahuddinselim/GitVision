declare module "@xterm/xterm/css/xterm.css" {
  const content: string;
  export default content;
}

declare module "@xterm/xterm" {
  interface TerminalOptions {
    fontFamily?: string;
    fontSize?: number;
    cursorBlink?: boolean;
    theme?: TerminalTheme;
    [key: string]: any;
  }
  interface TerminalTheme {
    background?: string;
    foreground?: string;
    cursor?: string;
    black?: string;
    red?: string;
    green?: string;
    yellow?: string;
    blue?: string;
    magenta?: string;
    cyan?: string;
    white?: string;
    brightBlack?: string;
    brightRed?: string;
    brightGreen?: string;
    brightYellow?: string;
    brightBlue?: string;
    [key: string]: any;
  }
  class Terminal {
    constructor(options?: TerminalOptions);
    open(container: HTMLElement): void;
    dispose(): void;
    writeln(data: string): void;
    write(data: string): void;
    onData(callback: (data: string) => void): void;
    loadAddon(addon: any): void;
    reset(): void;
    clear(): void;
    focus(): void;
    blur(): void;
    resize(columns: number, rows: number): void;
    scrollLines(amount: number): void;
    scrollToBottom(): void;
    readonly rows: number;
    readonly cols: number;
    getOption(key: string): any;
    setOption(key: string, value: any): void;
    refresh(start: number, end: number, queue?: boolean): void;
    scrollDisp(n: number): void;
    attachCustomKeydownHandler(
      callback: (event: KeyboardEvent) => boolean,
    ): void;
    fit?(): void;
  }
  export { Terminal };
  export default Terminal;
}

declare module "@xterm/addon-fit" {
  class FitAddon {
    constructor();
    activate(terminal: any): void;
    dispose(): void;
    fit(): void;
  }
  export = FitAddon;
  export { FitAddon };
  export default FitAddon;
}

declare module "@xterm/addon-web-links" {
  class WebLinksAddon {
    constructor();
    activate(terminal: any): void;
    dispose(): void;
  }
  export = WebLinksAddon;
  export { WebLinksAddon };
  export default WebLinksAddon;
}
