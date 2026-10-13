import Ajv, { AnySchema } from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

export function assertJsonSchema(schema: AnySchema, value: unknown): void {
  const validate = ajv.compile(schema);
  if (!validate(value)) {
    throw new Error(`JSON schema validation failed: ${ajv.errorsText(validate.errors)}`);
  }
}
