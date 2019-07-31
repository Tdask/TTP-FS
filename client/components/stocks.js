import React, { Component } from "react";
import { connect } from "react-redux";
// import { IEXClient } from "iex-api";
import * as _fetch from "isomorphic-fetch";
// const iex = require("iexcloud_api_wrapper");
import { buy, updateBalance, userTransactions, getPortfolio } from "../store";
import axios from "axios";
import { decimalCleaner, portfolioMaker } from "../helpers";

class unconnectedStocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      input: [],
      quote: {},
      quantity: 1,
      isEmpty: true,
      searchStock: null,
      boughtStock: null,
      isSearching: true,
      suggestions: [],
      activeSuggestion: 0,
      transactions: [],
      error: null
    };
    // this.getSymbols = this.getSymbols.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleBuy = this.handleBuy.bind(this);
    this.renderSuggestions = this.renderSuggestions.bind(this);
    this.selectSuggestion = this.selectSuggestion.bind(this);
    // this.handleKey = this.handleKey.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: false
    });
  }

  componentDidUpdate() {
    console.log("STOCKS CDU PROPS: ", this.props);
    console.log("STOCKS CDU LOCAL STATE: ", this.state);

    //can make portfolio object here when transactions updates..save transactions to local state if this.props.transactions.length is more than this.state.transactions
    if (this.props.transactions.transactions.length > this.state.transactions) {
      console.log("INSIDE of conditional to make portfolio");

      const portfolio = portfolioMaker(this.props.transactions.transactions);
      this.setState({
        transactions: this.props.transactions.transactions
      });
      //dispatch portfolio thunk here to update redux store...
      //add a portfolio: {} to store, make a thunk that dispatches an action that returns portfolio to store...
      this.props.getPortfolio(portfolio);
    }

    if (this.state.input.length > 0) {
      // console.log("INSIDE of input not empty conditional");
      if (this.state.isEmpty) {
        // console.log("INSIDE of isEmpty true");
        this.setState({
          isEmpty: false
        });
      }
    }

    if (this.state.input.length === 0 && !this.state.isEmpty) {
      // console.log("INSIDE of input is empty conditional");

      this.setState({
        isEmpty: true
      });
    }

    if (this.state.isEmpty) {
      // console.log("is empty");
      if (this.state.quote.symbol) {
        // console.log("there is a quote symbol");
        this.setState({
          quote: {}
        });
      }
    }

    //as soon as we start typing, if there was a previous searchedstock in local state, then we clear it
    if (this.state.searchStock) {
      this.setState({
        searchStock: null,
        quantity: 1
      });
    }
  }

  handleBuy(symbol, companyName, latestPrice, quantity) {
    let newBalance = this.props.balance - latestPrice * quantity;
    this.props.handleBuy(symbol, companyName, latestPrice, quantity);
    this.props.updateBalance(this.props.userId, newBalance);
    this.setState({
      input: [],
      quote: {},
      boughtStock: symbol,
      isSearching: true
    });
    // this.props.getTransactions();
    let newTrans = this.props.transactions.transactions.slice();
    newTrans.push({ symbol, latestPrice, quantity });
    console.log("new Trans after push ", newTrans);

    // .push({
    //   symbol,
    //   companyName,
    //   latestPrice,
    //   quantity
    // });
    console.log("newTrans: ", newTrans);

    const portfolio = portfolioMaker(newTrans);
    console.log("RETURNED Portfolio ", portfolio);
    this.props.getPortfolio(portfolio);

    // console.log("props inside of handleBuy: ", this.props, {
    //   symbol,
    //   companyName,
    //   latestPrice,
    //   quantity
    // });

    // this.props.history.push("/transactions");
  }

  handleChange(e) {
    // console.log("handle change called");
    const input = e.target.value;
    let suggestions = [];
    if (input.length > 0) {
      const regex = new RegExp(`^${input}`, "i");
      suggestions = this.props.allSymbols.filter(item =>
        regex.test(item.symbol)
      );
    }
    this.setState({
      input,
      suggestions
    });
  }

  // handleKey(e) {
  //   console.log("key code", e.keyCode);

  //   //if enter key is pressed
  //   if (e.keyCode === 13) {
  //     this.handleSubmit(e);
  //   }
  //   //if UP is pressed
  //   if (e.keyCode === 38) {
  //     if (this.state.activeSuggestion === 0) {
  //       return;
  //     }
  //     this.setState({
  //       activeSuggestion: this.state.activeSuggestion - 1
  //     });
  //   }
  //   //if DOWN is pressed
  //   if (e.keyCode === 40) {
  //     if (this.state.activeSuggestion - 1 === this.state.suggestions.length) {
  //       return;
  //     }
  //     this.setState({
  //       activeSuggestion: this.state.activeSuggestion + 1
  //     });
  //   }
  // }

  handleIncrement(n) {
    const quantity = this.state.quantity;
    const { latestPrice } = this.state.quote;
    const { balance } = this.props;
    const isPos = n > 0;
    // if (quantity * latestPrice ){}
    if (isPos) {
      if (latestPrice * quantity + latestPrice < balance) {
        this.setState({
          quantity: this.state.quantity + 1,
          error: null
        });
      }
      if (latestPrice * quantity + latestPrice > balance) {
        this.setState({
          error: "you do not have enough money"
        });
      }
    }
    if (!isPos && this.state.quantity > 1) {
      this.setState({
        quantity: this.state.quantity - 1,
        error: null
      });
    }
  }

  async handleSubmit(e) {
    try {
      e.preventDefault();
      const IEXCLOUD_PUBLIC_KEY = "pk_0b13685b98974e5c9501efc15246a72d";
      const URL =
        process.env.API_URL +
        `stable/stock/${this.state.input}/quote?token=${IEXCLOUD_PUBLIC_KEY}`;
      const res = await axios.get(URL);
      this.setState({
        searchStock: this.state.input,
        quote: res.data,
        boughtStock: null,
        isSearching: true,
        suggestions: []
      });
      // const stockData = await iex.quote(this.state.input);
      // console.log("stockData: ", stockData);
    } catch (error) {
      console.log(error);
    }
  }

  // async getSymbols() {
  //   // const iex = new IEXClient(_fetch);
  //   // const symbols = await iex.symbols();
  //   // return symbols.map(stock => stock.symbol);
  // }

  renderSuggestions() {
    const { suggestions } = this.state;
    return (
      suggestions && (
        <ul className="suggestions is-fixed">
          {suggestions.map((item, i) => {
            let className = "suggestion";
            if (i === this.state.activeSuggestion) {
              className = "suggestion-active";
            }

            return (
              <li
                className={className}
                key={i}
                onClick={() => this.selectSuggestion(item)}
              >
                {item.symbol} - {item.name}
              </li>
            );
          })}
        </ul>
      )
    );
  }

  selectSuggestion(item) {
    this.setState({
      input: item.symbol,
      suggestions: []
    });
  }

  render() {
    const { symbol, latestPrice, companyName } = this.state.quote;
    // console.log("COMPANY NAME: ", companyName);
    console.log("STOCKS props: ", this.props);
    console.log("STOCKS local state: ", this.state);

    // console.log("symbol:", symbol);
    const { userId, balance } = this.props;
    const { quantity, isEmpty } = this.state;
    // console.log("PROPSSSS: ", this.props);
    return (
      <div className="stick">
        <div className="box">
          <h3 className="title is-3">Balance: ${decimalCleaner(balance)}</h3>
        </div>
        <section className="section">
          <h2>Buy stock: </h2>
          <div className="box card is-vcentered">
            {/* <div>{symbolsArr && <div> {symbolsArr[3]}</div>}</div> */}
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="field">
                <div className="control">
                  Search by ticker symbol:{" "}
                  <div className="is-fixed">
                    <input
                      className="input"
                      type="text"
                      name="ticker"
                      placeholder="ex: AAPL"
                      onChange={e => this.handleChange(e)}
                      // onKeyDown={e => this.handleKey(e)}
                      value={this.state.input}
                      autoComplete="off"
                    />
                    {this.renderSuggestions()}
                  </div>
                </div>

                <button type="submit" className="button">
                  Search
                </button>
              </div>
            </form>
            <div>
              {symbol && !isEmpty && (
                <div>
                  <div className="title is-5">
                    <strong>{companyName}</strong>
                  </div>
                  <div className="title is-6">Price: {latestPrice}</div>

                  <div className="title is-6"> Qnty: {this.state.quantity}</div>
                  <button
                    className="button is-rounded"
                    onClick={() => this.handleIncrement(-1)}
                  >
                    -
                  </button>
                  <button
                    className="button is-rounded"
                    onClick={() => this.handleIncrement(1)}
                  >
                    +
                  </button>
                  <div className="title is-5">
                    Total: {decimalCleaner(latestPrice * this.state.quantity)}
                  </div>
                  <div>{this.state.error && <div>{this.state.error}</div>}</div>
                  <button
                    className="button is-success"
                    onClick={() => {
                      this.handleBuy(
                        symbol,
                        companyName,
                        latestPrice,
                        quantity
                      );
                    }}
                  >
                    Buy
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        <div>
          {this.state.boughtStock && (
            <section className="section">
              <div className="title is-4">
                you bought {this.state.quantity} shares of{" "}
                {this.state.boughtStock}{" "}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }
}

//how do we map the user's balance (from User.db) to state, to props? do we have to make a new action inside of user store?
const mapState = state => {
  return {
    balance: state.user.balance,
    userId: state.user.id,
    user: state.user,
    allSymbols: state.stock.symbols,
    transactions: state.transactions
  };
};

const mapDispatch = dispatch => {
  return {
    handleBuy(symbol, companyName, price, quantity) {
      // e.preventDefault();

      dispatch(buy(symbol, companyName, price, quantity));
    },
    updateBalance(id, updatedBalance) {
      dispatch(updateBalance(id, updatedBalance));
    },
    getTransactions() {
      dispatch(userTransactions());
    },
    getPortfolio(portfolio) {
      dispatch(getPortfolio(portfolio));
    }
  };
};

const Stocks = connect(
  mapState,
  mapDispatch
)(unconnectedStocks);

export default Stocks;
