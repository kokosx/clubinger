import { ZodRawShape, z } from "zod";

export const DEFAULT_PAGINATION_TAKE = 5;

export const schemaWithPagination = <
  T extends ZodRawShape & { limit?: number },
>(
  schema: z.ZodObject<T>,
) =>
  schema.extend({
    cursor: z.number().nullish(),
    limit: z.number().default(DEFAULT_PAGINATION_TAKE),
  });
