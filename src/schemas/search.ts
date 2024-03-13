import { z } from "zod";

export const searchValue = z.string().min(2);

export const simpleSearchSchema = z.object({ value: searchValue });
