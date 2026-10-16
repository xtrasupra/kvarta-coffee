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
  const [orderRequest, setOrderRequest] = useState(null);

  function selectCoffee(product) {
    setOrderRequest({
      type: "coffee",
      product,
    });
  }

  function selectSubscription() {
    setOrderRequest({
      type: "subscription",
    });
  }

  return (
    <div className="page" id="top">
      <Header />

      <main>
        <Hero />
        <Freshness />

        <Catalog onSelectCoffee={selectCoffee} />

        <Subscription
          onSelectSubscription={selectSubscription}
        />

        <About />

        <Contacts orderRequest={orderRequest} />
      </main>

      <Footer />
    </div>
  );
}

export default App;