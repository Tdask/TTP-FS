import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { userTransactions, getSymbols } from "../store";
import Stocks from "./stocks";

import {
  calculateTotal,
  decimalCleaner,
  performance,
  quantityChecker,
  portfolioMaker
} from "../helpers";

const IEXCLOUD_PUBLIC_KEY = "pk_0b13685b98974e5c9501efc15246a72d";

class unconnectedPortfolio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portfolio: {},
      totalValue: null
    };
    this.handleBatch = this.handleBatch.bind(this);
  }

  componentDidMount() {
    this.props.getTransactions();
    if (!this.props.allSymbols) {
      this.props.getSymbols();
    }

    this.interval = setInterval(() => {
      this.handleBatch(this.state.portfolio);
    }, 60000);
  }

  componentDidUpdate() {
    let portfolio = JSON.parse(JSON.stringify(this.props.portfolio));

    //get transactions initially
    if (
      Object.keys(this.props.portfolio).length > 0 &&
      this.props.transactions.transactions.length === 0
    ) {
      this.props.getTransactions();
    } else if (Object.keys(this.state.portfolio).length === 0) {
      //if no portfolio on state but on props, need to update local state
      if (
        this.props.portfolio.portfolio &&
        Object.keys(this.props.portfolio.portfolio).length > 0
      ) {
        this.handleBatch(this.props.portfolio.portfolio);
      }
    }

    //if no batchQuotes on state yet, make initial batch call to iex
    if (!this.state.batchQuotes && Object.keys(portfolio).length > 0) {
      this.handleBatch(portfolio);
    } else if (
      Object.keys(portfolio).length > 0 &&
      Object.keys(this.props.portfolio.portfolio).length >
        Object.keys(this.state.portfolio).length
    ) {
      //portfolio updates
      this.handleBatch(this.props.portfolio.portfolio);
    }

    //if items in both our props portfolio and our local state portfolio
    if (
      Object.keys(this.props.portfolio).length > 0 &&
      Object.keys(this.state.portfolio).length > 0
    ) {
      if (
        //if the quantities don't match need to update our state portfolio
        !quantityChecker(this.props.portfolio.portfolio, this.state.portfolio)
      ) {
        this.handleBatch(this.props.portfolio.portfolio);
      }
    }
  }

  async handleBatch(portfolio) {
    const symbolArr = Object.keys(portfolio);
    symbolArr[symbolArr.length - 1] = symbolArr[symbolArr.length - 1] + "&";

    const batchURL =
      process.env.API_URL +
      `stable/stock/market/batch?symbols=${symbolArr.join()}types=quote&token=${IEXCLOUD_PUBLIC_KEY}`;
    const res = await axios.get(batchURL);

    //helper function here is sent latest price, and portfolio which has quantity of each item. returns back a total value
    let result = decimalCleaner(calculateTotal(res.data, portfolio));
    this.setState({
      portfolio,
      batchQuotes: res.data,
      totalValue: result
    });
    this.props.getTransactions();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const transactions = this.props.transactions.transactions;
    const { portfolio } = this.state;
    const symbolArr = Object.keys(portfolio);
    const { batchQuotes } = this.state;

    return (
      <section className="section stick">
        <div className="columns is-vcentered level">
          <div className=" column level-left has-text-centered is-half try">
            <div className="hero">
              <h1 className="level-item title is-2">My Portfolio</h1>
              <div className="level-item box">
                {Object.keys(this.state.portfolio).length === 0 ? (
                  <h2 className="title is-3">waiting for stocks...</h2>
                ) : (
                  <h2 className="title is-3 is-fixed">
                    Total Value: ${this.state.totalValue}
                  </h2>
                )}
              </div>

              {batchQuotes ? (
                <ul>
                  <div>
                    {symbolArr.reverse().map(item => {
                      return (
                        <div className="box card" key={item}>
                          <div
                            className="title is-5"
                            style={
                              performance(
                                batchQuotes[item].quote.open ||
                                  batchQuotes[item].quote.previousClose,
                                batchQuotes[item].quote.latestPrice
                              )[0]
                            }
                          >
                            <div>
                              {item} x {portfolio[item].quantity}{" "}
                              <div>
                                {" "}
                                Current Value:{" "}
                                {decimalCleaner(
                                  batchQuotes[item].quote.latestPrice *
                                    portfolio[item].quantity
                                )}
                                <img
                                  src={
                                    performance(
                                      batchQuotes[item].quote.open ||
                                        batchQuotes[item].quote.previousClose,
                                      batchQuotes[item].quote.latestPrice
                                    )[1].img
                                  }
                                  width="30"
                                  height="30"
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <strong>
                              {batchQuotes[item].quote.companyName}
                            </strong>
                          </div>
                          <div>Quantity : {portfolio[item].quantity}</div>

                          <div>
                            Current Price: {batchQuotes[item].quote.latestPrice}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ul>
              ) : (
                Object.keys(this.state.portfolio).length > 0 && (
                  <div>loading up-to-date info..</div>
                )
              )}
            </div>
          </div>
          <div className="column level-right is-half has-text-centered try">
            <Stocks className="level-item is-centered" />
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
    transactions: state.transactions,
    portfolio: state.portfolio,
    allSymbols: state.stock.symbols
  };
};

const mapDispatch = dispatch => {
  return {
    getTransactions() {
      dispatch(userTransactions());
    },
    getSymbols() {
      dispatch(getSymbols());
    }
  };
};

const Portfolio = connect(
  mapState,
  mapDispatch
)(unconnectedPortfolio);

export default Portfolio;
