import { z } from "zod";

const ClientOrServerImplementationSchema = z.looseObject({
  name: z.string(),
  version: z.string(),
  title: z.optional(z.string()),
});

export type ServerConfiguration = z.infer<
  typeof ClientOrServerImplementationSchema
>;
