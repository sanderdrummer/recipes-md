import { Container, Text, ThemeToggle } from "@recipes-md/design-system";
import { Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { useShoppingList } from "./lib/shopping-list";
import Overview from "./pages/Overview";
import Recipe from "./pages/Recipe";
import ShoppingList from "./pages/ShoppingList";

export default function App() {
  const items = useShoppingList();
  const uncheckedCount = items.filter((i) => !i.checked).length;

  return (
    <Router hook={useHashLocation}>
      <div className="min-h-screen bg-background text-text">
        <header className="border-b border-border bg-surface">
          <Container className="flex items-center justify-between py-4">
            <a
              href="#/"
              className="rounded font-display text-2xl font-bold tracking-tight text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Rezepte
            </a>
            <div className="flex items-center gap-4">
              <a
                href="#/einkaufsliste"
                aria-label={`Einkaufsliste, ${uncheckedCount} Artikel`}
                className="flex items-center gap-2 rounded font-semibold text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Einkaufsliste
                {uncheckedCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="rounded-full border border-accent px-2 py-0.5 font-data text-xs"
                  >
                    {uncheckedCount}
                  </span>
                )}
              </a>
              <ThemeToggle />
            </div>
          </Container>
        </header>
        <main>
          <Container className="py-6">
            <Switch>
              <Route path="/" component={Overview} />
              <Route path="/rezept/:slug" component={Recipe} />
              <Route path="/einkaufsliste" component={ShoppingList} />
              <Route>
                <Text>Seite nicht gefunden.</Text>
              </Route>
            </Switch>
          </Container>
        </main>
      </div>
    </Router>
  );
}
