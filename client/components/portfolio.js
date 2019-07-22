import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { userTransactions } from "../store";
import transaction from "../store/transaction";
import { calculateTotal } from "../helpers";

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
    this.props.getTransactions();
    const transactions = this.props.transactions.transactions;
    console.log("tranzactions ", transactions);
    console.log("tranzz is array?", Array.isArray(transactions));
    const portfolio = {};
    transactions.forEach(trans => {
      // console.log("iterated trans: ", trans);
      if (!portfolio[trans.symbol]) {
        portfolio[trans.symbol] = { quantity: trans.quantity };
      } else {
        const prevQuantity = portfolio[trans.symbol].quantity;
        portfolio[trans.symbol] = { quantity: prevQuantity + trans.quantity };
      }
    });

    console.log("PORTFOLIO after iteration: ", portfolio);

    this.setState({
      portfolio: portfolio
    });
    this.handleBatch(portfolio);
  }

  async handleBatch(portfolio) {
    const symbolArr = Object.keys(portfolio);
    symbolArr[symbolArr.length - 1] = symbolArr[symbolArr.length - 1] + "&";
    const batchURL =
      process.env.API_URL +
      `stable/stock/market/batch?symbols=${symbolArr.join()}types=quote&token=${IEXCLOUD_PUBLIC_KEY}`;
    const res = await axios.get(batchURL);
    console.log("Batch Response: ", res.data);
    //helper function called here where we send in res.data, which contains latest price, and this.state.portfolio, which contains the quantity of each item. will return back a number value that we can then set to local state's Total Value
    let result = calculateTotal(res.data, portfolio);
    console.log("total value result: ", result);
    this.setState({
      ...this.state,
      batchQuotes: res.data,
      totalValue: result
    });
  }

  render() {
    console.log("local state: ", this.state);
    const { portfolio } = this.state;
    const symbolArr = Object.keys(portfolio);
    const { batchQuotes } = this.state;
    // console.log(symbolArr);
    console.log("batch quotes: ", batchQuotes);

    return (
      <section className="section">
        <div className="columns is-centered">
          <div className="column has-text-centered is-half">
            <h1 className="title is-2">My Portfolio</h1>
            <div className="box">
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
              <div>
                {symbolArr.map(item => {
                  return (
                    <h4 className="outline" key={item}>
                      Stock: {item}
                      <br />
                      Quantity : {portfolio[item].quantity} <br />
                      Current Price: {batchQuotes[item].quote.latestPrice}{" "}
                      <br />
                      Current Value:{" "}
                      {batchQuotes[item].quote.latestPrice *
                        portfolio[item].quantity}
                    </h4>
                  );
                })}
              </div>
            ) : (
              <div>loading up-to-date info..</div>
            )}
          </div>
        </div>
      </section>
    );
  }
}

const mapState = state => {
  return {
    transactions: state.transactions
  };
};

const mapDispatch = dispatch => {
  return {
    getTransactions() {
      dispatch(userTransactions());
    }
    // dispatch = ()=>userTransactions()
  };
};

const Portfolio = connect(
  mapState,
  mapDispatch
)(unconnectedPortfolio);

export default Portfolio;
