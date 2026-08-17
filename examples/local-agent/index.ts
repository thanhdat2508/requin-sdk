import { createMcpServer } from "@requin/sdk";
import { z } from "zod";

const mcpServer = createMcpServer(
  "https://cloud.requin.tech/vvbqlrkdtgjvaxwwkbst",
  "rq_production_0Ckic-EJd0OFxpCGEOExw_UBLzR7Kb",
);

mcpServer.tools({
  tools: [
    {
      name: "Get local time",
      description: "Get local time",
      parameters: z.object({}),
      execute: () => {
        return new Date().toISOString();
      },
    },
    {
      name: "Get weather",
      description: "Get weather in a city",
      parameters: z.object({
        city: z.string(),
      }),
      execute: ({ city }: { city: string }) => {
        return `Weather in ${city} is sunny`;
      },
    },
  ],
});

try {
  await mcpServer.connect();
} catch (error) {
  console.error(error);
}
