import React from "react";
import { connect } from "react-redux";
import { IEXClient } from "iex-api";
import * as _fetch from "isomorphic-fetch";
import Stocks from "./stocks";
import { decimalCleaner } from "../helpers";

const Home = props => {
  const { firstName, balance } = props;
  console.log("props inside of HOME: ", props);
  return (
    <section className="section">
      <div className="columns is-centered">
        <div className="column has-text-centered is-one-third">
          <h2 className="title is-2">Welcome, {firstName}</h2>
          <div className="box">
            <h3 className="title is-3">Balance: ${decimalCleaner(balance)}</h3>
          </div>
          <section className="section">
            <Stocks history={props.history} />
          </section>
        </div>
      </div>
    </section>
  );
};

const mapState = state => {
  return {
    firstName: state.user.firstName,
    balance: state.user.balance
  };
};

export default connect(mapState)(Home);
