import { Button, Text } from "@recipes-md/design-system";
import jsQR from "jsqr";
import { useEffect, useRef, useState } from "react";
import { decodeShare, ShareCodecError } from "@/features/sharing/share-codec";

interface ScanListDialogProps {
  onScanned: (texts: string[]) => void;
  onClose: () => void;
}

// Longest side of the canvas the video frames are sampled into. Screen-shown
// QR codes are high-contrast, so a reduced resolution decodes fine and keeps
// the ~10 fps jsQR loop cheap on the main thread.
const SAMPLE_SIZE = 480;
const SAMPLE_INTERVAL_MS = 100;

type Status =
  | { kind: "starting" }
  | { kind: "scanning" }
  | { kind: "invalid-code" }
  | { kind: "camera-error"; message: string };

function statusText(status: Status): string {
  switch (status.kind) {
    case "starting":
      return "Kamera wird gestartet …";
    case "scanning":
      return "Suche QR-Code … Richte die Kamera auf den Code auf dem anderen Gerät.";
    case "invalid-code":
      return "Dieser QR-Code ist keine geteilte Einkaufsliste. Du kannst weiter scannen.";
    case "camera-error":
      return status.message;
  }
}

// Modal that scans a shared-list QR code via the device camera.
export default function ScanListDialog({
  onScanned,
  onClose,
}: ScanListDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "starting" });

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const video: HTMLVideoElement = videoEl;

    let stream: MediaStream | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;
    let stopped = false;
    // Set while a decoded QR string is being processed, so overlapping frames
    // and repeated reads of the same code don't double-import.
    let handling = false;
    const canvas = document.createElement("canvas");

    function stop() {
      stopped = true;
      if (timer !== null) clearInterval(timer);
      for (const track of stream?.getTracks() ?? []) track.stop();
    }

    async function handleCode(data: string) {
      handling = true;
      try {
        const texts = await decodeShare(data);
        if (stopped) return;
        stop();
        onScanned(texts);
        dialogRef.current?.close();
      } catch (error) {
        if (error instanceof ShareCodecError) {
          setStatus({ kind: "invalid-code" });
          // Leave the scanner running; a valid code can still follow.
          handling = false;
        } else {
          throw error;
        }
      }
    }

    function scanFrame() {
      if (handling || video.readyState < video.HAVE_CURRENT_DATA) return;
      const scale = SAMPLE_SIZE / Math.max(video.videoWidth, video.videoHeight);
      canvas.width = Math.round(video.videoWidth * Math.min(scale, 1));
      canvas.height = Math.round(video.videoHeight * Math.min(scale, 1));
      const ctx = canvas.getContext("2d");
      if (!ctx || canvas.width === 0) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(image.data, image.width, image.height);
      if (code?.data) void handleCode(code.data);
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        if (stopped) {
          for (const track of s.getTracks()) track.stop();
          return;
        }
        stream = s;
        video.srcObject = s;
        return video.play().then(() => {
          setStatus({ kind: "scanning" });
          timer = setInterval(scanFrame, SAMPLE_INTERVAL_MS);
        });
      })
      .catch((error: unknown) => {
        if (stopped) return;
        const denied =
          error instanceof DOMException &&
          (error.name === "NotAllowedError" || error.name === "SecurityError");
        setStatus({
          kind: "camera-error",
          message: denied
            ? "Kein Kamera-Zugriff. Erlaube der App den Kamerazugriff in den iOS-Einstellungen und versuche es erneut."
            : "Die Kamera konnte nicht gestartet werden.",
        });
      });

    return stop;
  }, [onScanned]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="scan-list-title"
      className="max-w-sm rounded-xl border border-border bg-surface p-6 text-text backdrop:bg-background/80"
    >
      <h2 id="scan-list-title" className="text-lg font-semibold">
        Liste scannen
      </h2>
      {/* The live preview is purely visual; status below is the accessible output. */}
      <div aria-hidden="true">
        <video
          ref={videoRef}
          muted
          playsInline
          className="mt-4 aspect-square w-full rounded-lg border border-border object-cover"
        />
      </div>
      <Text muted className="mt-3" aria-live="polite">
        {statusText(status)}
      </Text>
      <Button onClick={() => dialogRef.current?.close()} className="mt-6">
        Abbrechen
      </Button>
    </dialog>
  );
}
