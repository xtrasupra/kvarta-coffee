import Header from "./components/Header";
import Hero from "./components/Hero";
import Freshness from "./components/Freshness";
import Catalog from "./components/Catalog";

import "./App.css";

function App() {
  return (
    <div className="page" id="top">
      <Header />

      <main>
        <Hero />
        <Freshness />
        <Catalog />
      </main>
    </div>
  );
}

export default App;