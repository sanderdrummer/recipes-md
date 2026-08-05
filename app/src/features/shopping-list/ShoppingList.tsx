import {
  Button,
  Card,
  Heading,
  Text,
  Textarea,
} from "@recipes-md/design-system";
import { type FormEvent, useState } from "react";
import ScanListDialog from "@/features/sharing/ScanListDialog";
import ShareListDialog from "@/features/sharing/ShareListDialog";
import {
  addMany,
  clearChecked,
  type ShoppingItem,
  toggle,
  useShoppingList,
} from "@/features/shopping-list/shopping-list";

export default function ShoppingList() {
  const items = useShoppingList();
  const [text, setText] = useState("");
  const [dialog, setDialog] = useState<"share" | "scan" | null>(null);
  const [notice, setNotice] = useState("");
  const unchecked = items.filter((i) => !i.checked);
  const checked = items.filter((i) => i.checked);

  function renderItem(item: ShoppingItem) {
    return (
      <li key={item.id}>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-surface-raised">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={() => toggle(item.id)}
            className="h-5 w-5 shrink-0 accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
          <span
            className={
              item.checked ? "text-text-muted line-through" : "text-text"
            }
          >
            {item.text}
          </span>
        </label>
      </li>
    );
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    addMany(lines);
    setText("");
  }

  function importScanned(texts: string[]) {
    addMany(texts);
    setNotice(
      texts.length === 1
        ? "1 Artikel hinzugefügt"
        : `${texts.length} Artikel hinzugefügt`,
    );
  }

  return (
    <div className="space-y-6">
      <Heading level={1}>Einkaufsliste</Heading>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Artikel hinzufügen — eine Zeile pro Eintrag…"
          aria-label="Artikel hinzufügen"
        />
        <div className="flex flex-wrap gap-2">
          <Button type="submit">Hinzufügen</Button>
          {unchecked.length > 0 && (
            <Button variant="secondary" onClick={() => setDialog("share")}>
              Teilen
            </Button>
          )}
          <Button variant="secondary" onClick={() => setDialog("scan")}>
            Scannen
          </Button>
        </div>
      </form>

      <p aria-live="polite" className="text-text-muted">
        {notice}
      </p>

      {items.length === 0 ? (
        <Card>
          <Text muted>Die Liste ist leer.</Text>
        </Card>
      ) : (
        <>
          {unchecked.length > 0 && (
            <Card>
              <div className="flex items-baseline justify-between gap-2">
                <Heading level={2}>Offen</Heading>
                <span className="text-sm font-medium text-text-muted tabular-nums">
                  {unchecked.length}
                </span>
              </div>
              <ul className="mt-3 space-y-1">{unchecked.map(renderItem)}</ul>
            </Card>
          )}
          {checked.length > 0 && (
            <Card>
              <div className="flex items-baseline justify-between gap-2">
                <Heading level={2}>Erledigt</Heading>
                <span className="text-sm font-medium text-text-muted tabular-nums">
                  {checked.length}
                </span>
              </div>
              <ul className="mt-3 space-y-1">{checked.map(renderItem)}</ul>
              <Button
                variant="secondary"
                onClick={clearChecked}
                className="mt-4"
              >
                Erledigte löschen
              </Button>
            </Card>
          )}
        </>
      )}

      {dialog === "share" && (
        <ShareListDialog
          texts={unchecked.map((i) => i.text)}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === "scan" && (
        <ScanListDialog
          onScanned={importScanned}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}
