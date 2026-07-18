import { Button, Heading, Input, Text } from "@recipes-md/design-system";
import { type FormEvent, useState } from "react";
import ScanListDialog from "../components/ScanListDialog";
import ShareListDialog from "../components/ShareListDialog";
import {
  add,
  addMany,
  clearChecked,
  toggle,
  useShoppingList,
} from "../lib/shopping-list";

export default function ShoppingList() {
  const items = useShoppingList();
  const [text, setText] = useState("");
  const [dialog, setDialog] = useState<"share" | "scan" | null>(null);
  const [notice, setNotice] = useState("");
  const hasChecked = items.some((i) => i.checked);
  const unchecked = items.filter((i) => !i.checked);

  function submit(e: FormEvent) {
    e.preventDefault();
    add(text);
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
    <div>
      <Heading level={1}>Einkaufsliste</Heading>

      <form onSubmit={submit} className="mt-4 flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Artikel hinzufügen…"
          aria-label="Artikel hinzufügen"
        />
        <Button type="submit">Hinzufügen</Button>
      </form>

      <div className="mt-4 flex gap-2">
        {unchecked.length > 0 && (
          <Button onClick={() => setDialog("share")}>Teilen</Button>
        )}
        <Button onClick={() => setDialog("scan")}>Scannen</Button>
      </div>

      <p aria-live="polite" className="mt-2 text-text-muted">
        {notice}
      </p>

      {items.length === 0 ? (
        <Text muted className="mt-6">
          Die Liste ist leer.
        </Text>
      ) : (
        <ul className="mt-4 space-y-1">
          {items.map((item) => (
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
          ))}
        </ul>
      )}

      {hasChecked && (
        <Button onClick={clearChecked} className="mt-6">
          Erledigte löschen
        </Button>
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
