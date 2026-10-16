import { useState } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Freshness from "./components/Freshness";
import Catalog from "./components/Catalog";
import Subscription from "./components/Subscription";
import About from "./components/About";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  const [selectedCoffee, setSelectedCoffee] = useState(null);

  function selectCoffee(product) {
    setSelectedCoffee({ ...product });
  }

  return (
    <div className="page" id="top">
      <Header />

      <main>
        <Hero />
        <Freshness />

        <Catalog onSelectCoffee={selectCoffee} />

        <Subscription />
        <About />

        <Contacts selectedCoffee={selectedCoffee} />
      </main>

      <Footer />
    </div>
  );
}

export default App;