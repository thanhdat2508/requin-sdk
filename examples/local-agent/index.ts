import { createMcpServer } from "@requin/sdk";
import { z } from "zod";

const mcpServer = createMcpServer(
  "https://cloud.requin.tech/vvbqlrkdtgjvaxwwkbst",
  "rq_production_0Ckic-EJd0OFxpCGEOExw_UBLzR7Kb",
);

mcpServer.tools({
  tools: [
    {
      name: "get_shipping_order",
      description: "Lấy thông tin đơn giao",
      parameters: z.object({ orderId: z.string() }),
      privacy: {
        customPrefix: "SECURE",
        patterns: [
          "order_address",
          /^diem_tra_/i,
          (key, val) => key === "internal_note",
        ],
      },
      execute: async () => {
        return {
          orderId: "ORD-999",
          status: "shipping",
          email: "khach@gmail.com",
          phone: "0912345678",
          order_address: "Kho A - Cảng Cát Lái",
          diem_tra_hang: "Bưu cục 10",
          internal_note: "Khách VIP không gọi trưa",
        };
      },
    },
  ],
});

try {
  await mcpServer.connect();
} catch (error) {
  console.error(error);
}
