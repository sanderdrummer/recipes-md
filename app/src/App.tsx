import { Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import Overview from "./pages/Overview";
import Recipe from "./pages/Recipe";

export default function App() {
  return (
    <Router hook={useHashLocation}>
      <div className="min-h-screen bg-amber-50 text-stone-800">
        <header className="border-b border-amber-200 bg-amber-100">
          <div className="mx-auto max-w-3xl px-4 py-4">
            <a href="#/" className="text-2xl font-bold text-amber-800">
              Rezepte
            </a>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-6">
          <Switch>
            <Route path="/" component={Overview} />
            <Route path="/rezept/:slug" component={Recipe} />
            <Route>
              <p className="text-stone-600">Seite nicht gefunden.</p>
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}
