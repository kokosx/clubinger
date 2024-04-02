import { ZodRawShape, z } from "zod";

export const DEFAULT_PAGINATION_TAKE = 5;

export const schemaWithPagination = <
  T extends ZodRawShape & { limit?: number },
>(
  schema: z.ZodObject<T>,
  limit = DEFAULT_PAGINATION_TAKE,
) =>
  schema.extend({
    cursor: z.number().nullish(),
    limit: z.number().default(limit),
  });

export const schemaWithOffsetPagination = <
  T extends ZodRawShape & { limit?: number; skip?: number },
>(
  schema: z.ZodObject<T>,
  limit = DEFAULT_PAGINATION_TAKE,
  skip = 0,
) =>
  schema.extend({
    cursor: z.number().nullish(),
    skip: z.number().default(skip),
    limit: z.number().default(limit),
  });
