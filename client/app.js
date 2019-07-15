import React from "react";
import Routes from "./routes";
import { Navbar } from "./components";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
      <h1>Inside of APP</h1>
    </div>
  );
};

export default App;
