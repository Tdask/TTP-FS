import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { userTransactions, getSymbols } from "../store";
import transaction from "../store/transaction";
// import { calculateTotal } from "../helpers";
import Stocks from "./stocks";
import Home from "./home";

import {
  calculateTotal,
  decimalCleaner,
  performance,
  portfolioMaker
} from "../helpers";

const IEXCLOUD_PUBLIC_KEY = "pk_0b13685b98974e5c9501efc15246a72d";
const dummySymbols = ["B", "A", "AAPL", "E", "L"];
dummySymbols[dummySymbols.length - 1] =
  dummySymbols[dummySymbols.length - 1] + "&";
const batchURL =
  process.env.API_URL +
  `/stable/stock/market/batch?symbols=${dummySymbols.join()}types=quote&token=${IEXCLOUD_PUBLIC_KEY}`;

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
    console.log("component did mount");
    this.props.getTransactions();
    if (!this.props.allSymbols) {
      console.log("WE HAVE TO GET ALL THE SYMBOLS!!!!!!!!!");

      this.props.getSymbols();
    }

    // console.log("props immediately after calling getTransactions", this.props);
    // const transactions = this.props.transactions.transactions;
    // console.log("tranzactions ", transactions);
    // // console.log("tranzz is array?", Array.isArray(transactions));
    // const portfolio = {};
    // transactions.forEach(trans => {
    //   // console.log("iterated trans: ", trans);
    //   if (!portfolio[trans.symbol]) {
    //     portfolio[trans.symbol] = { quantity: trans.quantity };
    //   } else {
    //     const prevQuantity = portfolio[trans.symbol].quantity;
    //     portfolio[trans.symbol] = { quantity: prevQuantity + trans.quantity };
    //   }
    // });

    // console.log("PORTFOLIO after iteration: ", portfolio);

    // this.setState({
    //   portfolio: portfolio
    // });
    // this.handleBatch(portfolio);

    // this.interval = setInterval(() => {
    //   console.log("interval triggered");
    //   this.handleBatch(portfolio);
    // }, 60000);
  }

  componentDidUpdate() {
    //if there are no this.props.transactions, call this.getTransactions
    // this.props.getTransactions();
    console.log("componendDidUpdate props: ", this.props);
    console.log("componendDidUpdate local state: ", this.state);
    //if there is no this.state.portfolio, call portfolio helper function to make one (dont set to state just yet)
    let portfolio = JSON.parse(JSON.stringify(this.state.portfolio));

    if (
      Object.keys(this.props.portfolio).length > 0 &&
      Object.keys(this.props.transactions).length === 0
    ) {
      console.log("we need to get transactions");

      this.props.getTransactions();
    } else if (Object.keys(this.state.portfolio).length === 0) {
      console.log("there is no portfolio on state");
      if (Object.keys(this.props.portfolio).length > 0) {
        console.log("INSIDE need to create portfolio conditional");

        // portfolio = portfolioMaker(this.props.transactions.transactions);
        this.handleBatch(this.props.portfolio.portfolio);
      }
    }
    //for buying more of the same stock: if this.props.transactions.transactions.length > Object.keys(this.state.portfolio).length, then we need to make a new portfolio object with this.props.transactions.transactions and call handleBatch with it.
    // if (
    //   this.props.transactions.transactions.length >
    //   Object.keys(this.state.portfolio).length
    // ) {
    //   console.log("we gotta update the quantity of a pre-existing item");

    //   portfolio = portfolioMaker(this.props.transactions.transactions);
    //   this.handleBatch(portfolio);
    // }

    //if no this.state.batchQuotes, make initial batch call to iex to get batchquotes (dont set to state yet)
    if (!this.state.batchQuotes && Object.keys(portfolio).length > 0) {
      console.log("no batchQuote condition triggered");
      this.handleBatch(portfolio);
    } else if (
      Object.keys(portfolio).length > 0 &&
      Object.keys(this.props.portfolio.portfolio).length >
        Object.keys(this.state.portfolio).length
    ) {
      console.log("inside of need to update portfolio conditional");
      this.handleBatch(this.props.portfolio.portfolio);
    }
  }

  async handleBatch(portfolio) {
    console.log("inside of handleBatch", portfolio);
    const symbolArr = Object.keys(portfolio);
    console.log("our symbolArr ", symbolArr);

    symbolArr[symbolArr.length - 1] = symbolArr[symbolArr.length - 1] + "&";

    const batchURL =
      process.env.API_URL +
      `stable/stock/market/batch?symbols=${symbolArr.join()}types=quote&token=${IEXCLOUD_PUBLIC_KEY}`;
    console.log("OUR Batch URL: ", batchURL);
    const res = await axios.get(batchURL);
    console.log("Batch Response: ", res.data);
    //helper function called here where we send in res.data, which contains latest price, and this.state.portfolio, which contains the quantity of each item. will return back a number value that we can then set to local state's Total Value
    let result = decimalCleaner(calculateTotal(res.data, portfolio));
    // console.log("total value result: ", result);
    this.setState({
      portfolio,
      batchQuotes: res.data,
      totalValue: result
    });
    this.props.getTransactions();
    // console.log("state immediately after being set in handleBatch", this.state);

    // if (!this.interval) {
    //   this.interval = setInterval(() => {
    //     // console.log("interval");
    //     this.handleBatch(this.state.portfolio);
    //   }, 60000);
    // }
  }
  componentWillUnmount() {
    // clearInterval(this.interval);
  }

  render() {
    // console.log("PORTFOLIO props", this.props);
    // console.log("PORTFOLIO local state", this.state);
    const transactions = this.props.transactions.transactions;
    const { portfolio } = this.state;
    const symbolArr = Object.keys(portfolio);
    const { batchQuotes } = this.state;
    // console.log("BATCHQUOTES ", batchQuotes);

    return (
      <section className="section">
        <div className="columns is-flex is-vcentered level">
          <div className=" column level-left stick has-text-centered is-half">
            <h1 className="level-item title is-2">My Portfolio</h1>
            <div className="level-item box">
              <h2 className="title is-3">
                Total Value: ${this.state.totalValue}
              </h2>
            </div>
            {/* {symbolArr &&
          symbolArr.map(item => (
            <h4 className="outline" key={item}>
              Stock: {item} <br />
              Quantity: {portfolio[item].quantity}
            </h4>
          ))} */}
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
                          <strong>
                            Symbol: {item} Current Price:{" "}
                            {batchQuotes[item].quote.latestPrice}
                          </strong>
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
                        <div>
                          <strong>{batchQuotes[item].quote.companyName}</strong>
                        </div>
                        <div>Quantity : {portfolio[item].quantity}</div>

                        <div>
                          Current Value:{" "}
                          {decimalCleaner(
                            batchQuotes[item].quote.latestPrice *
                              portfolio[item].quantity
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ul>
            ) : (
              <div>loading up-to-date info..</div>
            )}
          </div>
          <div className="column level-right is-half has-text-centered">
            <Stocks className="level-item" />
          </div>
        </div>
      </section>
    );
  }
}

const mapState = state => {
  return {
    transactions: state.transactions,
    portfolio: state.portfolio
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
    // dispatch = ()=>userTransactions()
  };
};

const Portfolio = connect(
  mapState,
  mapDispatch
)(unconnectedPortfolio);

export default Portfolio;
