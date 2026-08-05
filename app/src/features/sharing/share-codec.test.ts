import { describe, expect, it } from "vitest";
import { decodeShare, encodeShare, ShareCodecError } from "./share-codec";

describe("share codec", () => {
  it("round-trips a list of item texts", async () => {
    const texts = ["300g Mehl", "2 Eier", "1l Milch", "Salz"];
    expect(await decodeShare(await encodeShare(texts))).toEqual(texts);
  });

  it("round-trips an empty list", async () => {
    expect(await decodeShare(await encodeShare([]))).toEqual([]);
  });

  it("produces a versioned prefix", async () => {
    expect(await encodeShare(["Milch"])).toMatch(/^recipesmd:v1:/);
  });

  it("rejects payloads without the prefix as foreign", async () => {
    await expect(decodeShare("https://example.com")).rejects.toMatchObject({
      name: "ShareCodecError",
      kind: "foreign",
    });
  });

  it("rejects corrupt base64 data", async () => {
    await expect(
      decodeShare("recipesmd:v1:!!!not-base64!!!"),
    ).rejects.toMatchObject({ name: "ShareCodecError", kind: "corrupt" });
  });

  it("rejects valid deflate that is not a string array", async () => {
    const valid = await encodeShare(["Milch"]);
    // Re-encode a non-array JSON value through the same pipeline.
    const stream = new Blob([new TextEncoder().encode('{"a":1}')])
      .stream()
      .pipeThrough(new CompressionStream("deflate-raw"));
    const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    const forged = valid.slice(0, "recipesmd:v1:".length) + btoa(binary);
    await expect(decodeShare(forged)).rejects.toMatchObject({
      name: "ShareCodecError",
      kind: "corrupt",
    });
  });

  it("rejects lists whose compressed size exceeds the cap", async () => {
    // Random-ish suffixes defeat compression so the payload really grows.
    const texts = Array.from(
      { length: 400 },
      (_, i) => `Artikel ${i} ${(i * 2654435761) % 100000}xyz`,
    );
    await expect(encodeShare(texts)).rejects.toMatchObject({
      name: "ShareCodecError",
      kind: "too-large",
    });
    expect(new ShareCodecError("too-large", "x").kind).toBe("too-large");
  });
});
