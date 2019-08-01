import React, { Component } from "react";
import { connect } from "react-redux";
import { IEXClient } from "iex-api";
import * as _fetch from "isomorphic-fetch";
import Stocks from "./stocks";
import { decimalCleaner } from "../helpers";
import { getSymbols } from "../store";

class Home extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.allSymbols) {
      this.props.getSymbols();
    }
  }

  render() {
    const { firstName, balance } = this.props;
    return (
      <section className="section">
        <div className="columns is-flex is-vcentered">
          <div className="column has-text-centered is-full">
            <h2 className="title is-2">Welcome, {firstName}</h2>
            <div className="box">
              <h3 className="title is-3">
                Balance: ${decimalCleaner(balance)}
              </h3>
            </div>
            <section className="section">
              <Stocks history={this.props.history} />
            </section>
          </div>
        </div>
      </section>
    );
  }
}

const mapState = state => {
  return {
    firstName: state.user.firstName,
    balance: state.user.balance,
    allSymbols: state.stock.symbols
  };
};

const mapDispatch = dispatch => {
  return {
    getSymbols() {
      dispatch(getSymbols());
    }
  };
};

export default connect(
  mapState,
  mapDispatch
)(Home);
