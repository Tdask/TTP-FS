import React from "react";
import Routes from "./routes";
import { Navbar } from "./components";

const App = () => {
  return (
    <div>
      {/* <h1>hey there</h1> */}
      <Navbar />
      <Routes />
    </div>
  );
};

export default App;
