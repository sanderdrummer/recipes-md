import { Container, Text, ThemeToggle } from "@recipes-md/design-system";
import { Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import Overview from "./pages/Overview";
import Recipe from "./pages/Recipe";

export default function App() {
  return (
    <Router hook={useHashLocation}>
      <div className="min-h-screen bg-background text-text">
        <header className="border-b border-border bg-surface">
          <Container className="flex items-center justify-between py-4">
            <a
              href="#/"
              className="rounded text-2xl font-bold text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Rezepte
            </a>
            <ThemeToggle />
          </Container>
        </header>
        <main>
          <Container className="py-6">
            <Switch>
              <Route path="/" component={Overview} />
              <Route path="/rezept/:slug" component={Recipe} />
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
