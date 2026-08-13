import { generateObject } from "ai";
import type { z } from "zod";

import { describeAiError, getModel, RESPONSIBLE_AI_RULES } from "./ai-gateway.server";

export async function runStructured<T extends z.ZodType>({
  schema,
  schemaName,
  system,
  prompt,
}: {
  schema: T;
  schemaName: string;
  system: string;
  prompt: string;
}): Promise<z.infer<T>> {
  try {
    const { object } = await generateObject({
      model: getModel(),
      schema,
      schemaName,
      schemaDescription: `Return ONLY the fields defined in the ${schemaName} schema, using exactly those field names.`,
      system: `${system}\n\n${RESPONSIBLE_AI_RULES}\n\nAlways respond with JSON that matches the requested schema exactly, using its exact field names. Do not rename, add or omit fields.`,
      prompt,
    });
    return object as z.infer<T>;
  } catch (error) {
    console.error("AI request failed", error);
    const { message } = describeAiError(error);
    throw new Error(message);
  }
}