import React from "react";
import { connect } from "react-redux";
import { IEXClient } from "iex-api";
import * as _fetch from "isomorphic-fetch";
import Stocks from "./stocks";

const Home = props => {
  const { firstName, balance } = props;
  return (
    <div>
      <h2>Welcome, {firstName}</h2>
      <div>
        <h3>Balance: {balance}</h3>
      </div>
      <div>
        <Stocks />
      </div>
    </div>
  );
};

const mapState = state => {
  return {
    firstName: state.user.firstName,
    balance: state.user.balance
  };
};

export default connect(mapState)(Home);
