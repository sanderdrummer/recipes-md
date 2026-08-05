import { Button, Text } from "@recipes-md/design-system";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import { encodeShare, ShareCodecError } from "@/features/sharing/share-codec";

interface ShareListDialogProps {
  texts: string[];
  onClose: () => void;
}

// Modal showing the given item texts as a scannable QR code.
export default function ShareListDialog({
  texts,
  onClose,
}: ShareListDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    let cancelled = false;
    encodeShare(texts)
      .then((payload) => {
        if (cancelled || !canvasRef.current) return;
        // Fixed black-on-white regardless of theme: QR codes need maximum
        // optical contrast to scan reliably, this is data, not UI chrome.
        return QRCode.toCanvas(canvasRef.current, payload, {
          width: 288,
          margin: 3,
          errorCorrectionLevel: "M",
          color: { dark: "#000000", light: "#ffffff" },
        });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(
          e instanceof ShareCodecError && e.kind === "too-large"
            ? "Die Liste ist zu lang für einen QR-Code. Lösche erledigte Artikel und versuche es erneut."
            : "Der QR-Code konnte nicht erstellt werden.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [texts]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="share-list-title"
      className="max-w-sm rounded-xl border border-border bg-surface p-6 text-text backdrop:bg-background/80"
    >
      <h2 id="share-list-title" className="text-lg font-semibold">
        Liste teilen
      </h2>
      <Text muted className="mt-2">
        Öffne auf dem anderen Gerät die Einkaufsliste und tippe auf „Scannen“,
        um diesen Code zu scannen.
      </Text>
      {error ? (
        <p className="mt-4 text-text" role="alert">
          {error}
        </p>
      ) : (
        <canvas
          ref={canvasRef}
          className="mx-auto mt-4 rounded-lg"
          aria-label={`QR-Code mit ${texts.length} Artikeln der Einkaufsliste`}
          role="img"
        />
      )}
      <Button onClick={() => dialogRef.current?.close()} className="mt-6">
        Schließen
      </Button>
    </dialog>
  );
}
