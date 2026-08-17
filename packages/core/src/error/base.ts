const marker = "requin.mcp.error";
const symbol = Symbol.for(marker);

export class McpSDKError extends Error {
  private readonly [symbol] = true;

  readonly cause?: unknown;

  constructor({
    name,
    message,
    cause,
  }: {
    name: string;
    message: string;
    cause?: unknown;
  }) {
    super(message);
    this.name = name;
    this.cause = cause;
  }

  protected static hasMarker(error: unknown, marker: string): boolean {
    const markerSymbol = Symbol.for(marker);

    return (
      error != null &&
      typeof error === "object" &&
      markerSymbol in error &&
      typeof error[markerSymbol] === "boolean" &&
      error[markerSymbol] === true
    );
  }

  static isInstance(error: unknown): error is McpSDKError {
    return this.hasMarker(error, marker);
  }
}
