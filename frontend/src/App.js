import Header from "./components/Header";
import Hero from "./components/Hero";
import Freshness from "./components/Freshness";
import Catalog from "./components/Catalog";
import Subscription from "./components/Subscription";
import About from "./components/About";

import "./App.css";

function App() {
  return (
    <div className="page" id="top">
      <Header />

      <main>
        <Hero />
        <Freshness />
        <Catalog />
        <Subscription />
        <About />
      </main>
    </div>
  );
}

export default App;