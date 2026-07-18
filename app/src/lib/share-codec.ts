// Versioned QR payload codec for sharing the shopping list between devices.
// Format: "recipesmd:v1:" + base64(deflate-raw(JSON string array)).

const PREFIX = "recipesmd:v1:";

// Keep the QR at a comfortably scannable density.
export const MAX_PAYLOAD_BYTES = 2048;

export type ShareCodecErrorKind = "foreign" | "corrupt" | "too-large";

export class ShareCodecError extends Error {
  readonly kind: ShareCodecErrorKind;

  constructor(kind: ShareCodecErrorKind, message: string) {
    super(message);
    this.name = "ShareCodecError";
    this.kind = kind;
  }
}

async function collectStream(
  bytes: Uint8Array,
  transform: CompressionStream | DecompressionStream,
): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(transform);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(text: string): Uint8Array {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function encodeShare(texts: string[]): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(texts));
  const deflated = await collectStream(
    json,
    new CompressionStream("deflate-raw"),
  );
  if (deflated.length > MAX_PAYLOAD_BYTES) {
    throw new ShareCodecError(
      "too-large",
      `Compressed payload is ${deflated.length} bytes (max ${MAX_PAYLOAD_BYTES})`,
    );
  }
  return PREFIX + toBase64(deflated);
}

export async function decodeShare(payload: string): Promise<string[]> {
  if (!payload.startsWith(PREFIX)) {
    throw new ShareCodecError("foreign", "Not a recipes-md share payload");
  }
  try {
    const deflated = fromBase64(payload.slice(PREFIX.length));
    const json = await collectStream(
      deflated,
      new DecompressionStream("deflate-raw"),
    );
    const parsed: unknown = JSON.parse(new TextDecoder().decode(json));
    if (
      !Array.isArray(parsed) ||
      !parsed.every((t): t is string => typeof t === "string")
    ) {
      throw new Error("payload is not a string array");
    }
    return parsed;
  } catch (error) {
    if (error instanceof ShareCodecError) throw error;
    throw new ShareCodecError("corrupt", `Unreadable payload: ${error}`);
  }
}
