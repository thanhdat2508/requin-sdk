import { Transport } from "@modelcontextprotocol/sdk/shared/transport";
import { JSONRPCMessage } from "@modelcontextprotocol/sdk/types";
import WebSocket from "ws";

export class WebsocketTransport implements Transport {
  private ws: WebSocket;
  private _onMessage?: (message: JSONRPCMessage) => void;
  private _onclose?: () => void;
  private _onerror?: (error: Error) => void;

  constructor(url: string, apiKey: string) {
    this.ws = new WebSocket(url, {
      headers: { "x-api-key": apiKey },
    });
  }

  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws.on("open", resolve);
      this.ws.on("close", reject);

      this.ws.on("unexpected-response", (req, res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          const errMsg = `[Requin SDK] Server rejected WebSocket connection with HTTP ${res.statusCode}: ${body || res.statusMessage}`;
          console.error(errMsg);
          reject(new Error(errMsg));
        });
      });

      this.ws.on("message", (data: Buffer) => {
        try {
          const parsedMessage: JSONRPCMessage = JSON.parse(data.toString());
          if (this._onMessage) {
            this._onMessage(parsedMessage);
          }
        } catch (error) {
          console.error("Failed to parse incoming JSON-RPC message:", error);
          if (this._onerror) this._onerror(error as Error);
        }
      });

      this.ws.on("close", (error) => {
        if (error === 1006) {
          console.error(
            `\x1b[31mConnection closed abnormally (1006). Please verify your endpoint URL and API Key.`,
          );
        }
        if (this._onclose) this._onclose();
        reject(error);
      });

      this.ws.on("error", (error) => {
        if (this._onerror) this._onerror(error);
      });
    });
  }

  async send(message: JSONRPCMessage): Promise<void> {
    if (this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("Cannot send message: WebSocket is not open.");
    }
    this.ws.send(JSON.stringify(message));
  }

  async close(): Promise<void> {
    this.ws.close();
  }
}
