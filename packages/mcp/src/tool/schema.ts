import { ZodSchema } from "zod";

/**
 * Support for all schema not only for Zod
 */
export type FlexibleSchema<SCHEMA = unknown> = ZodSchema<SCHEMA>;
