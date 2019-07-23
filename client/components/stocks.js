import React, { Component } from "react";
import { connect } from "react-redux";
// import { IEXClient } from "iex-api";
import * as _fetch from "isomorphic-fetch";
// const iex = require("iexcloud_api_wrapper");
import { buy, updateBalance } from "../store";
import axios from "axios";
import { decimalCleaner } from "../helpers";

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
      error: null
    };
    // this.getSymbols = this.getSymbols.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleBuy = this.handleBuy.bind(this);
  }

  componentDidMount() {
    // const symbolsArr = this.getSymbols();
    // console.log("symbols array: ", symbolsArr);
    console.log("component did mount props: ", this.props);
    console.log(
      "component did mount state before setting loading to false: ",
      this.state
    );

    this.setState({
      isLoading: false
      // symbolsArr
    });
  }

  componentDidUpdate() {
    console.log("component did update props", this.props);
    console.log("component did update state", this.state);
    // console.log("input", this.state.input);

    console.log(this.state.isEmpty);
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
        searchStock: null
      });
    }

    console.log("state at the end of component did update", this.state);
  }

  handleBuy(symbol, latestPrice, quantity) {
    console.log("made it inside: ", symbol, latestPrice, quantity);
    let newBalance = this.props.balance - latestPrice * quantity;
    this.props.handleBuy(symbol, latestPrice, quantity);
    this.props.updateBalance(this.props.userId, newBalance);
    this.setState({
      input: [],
      quote: {},
      boughtStock: symbol,
      isSearching: true
    });
    console.log("state right after handleBuy setState", this.state);
    // this.props.history.push("/transactions");
  }

  handleChange(e) {
    console.log("handle change called");
    console.log(e.currentTarget.value);
    this.setState({
      // ...this.state,
      input: e.target.value
    });
    // console.log("after updating input: ", this.state.input);
    // if (this.state.input.length > 1) {
    //   this.setState({
    //     isEmpty: false
    //   });
    // }
    // console.log("after checking length");
    // if (this.state.input.length === 0) {
    //   this.setState({
    //     isEmpty: true
    //   });
    // }
    // console.log("after checking empty");
  }

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
      console.log(this.state.input);
      const IEXCLOUD_PUBLIC_KEY = "pk_0b13685b98974e5c9501efc15246a72d";
      const URL =
        process.env.API_URL +
        `stable/stock/${this.state.input}/quote?token=${IEXCLOUD_PUBLIC_KEY}`;
      const res = await axios.get(URL);
      console.log("res.data: ", res.data);
      this.setState({
        searchStock: this.state.input,
        quote: res.data,
        boughtStock: null,
        isSearching: true
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
  render() {
    console.log("render local state ", this.state);
    console.log("render props ", this.props);
    const { symbol, latestPrice, companyName } = this.state.quote;
    // console.log("symbol:", symbol);
    const { userId } = this.props;
    const { quantity, isEmpty } = this.state;
    // console.log("PROPSSSS: ", this.props);
    return (
      <div>
        <div className=" outline">
          {/* <div>{symbolsArr && <div> {symbolsArr[3]}</div>}</div> */}
          <form className="form" onSubmit={this.handleSubmit}>
            <div className="field">
              <div className="control">
                Stock:{" "}
                <div>
                  <input
                    className="input"
                    type="text"
                    name="ticker"
                    placeholder="ex: AAPL"
                    onChange={e => this.handleChange(e)}
                    value={this.state.input}
                  />
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
                    this.handleBuy(symbol, latestPrice, quantity);
                  }}
                >
                  Buy
                </button>
              </div>
            )}
          </div>
        </div>
        <div>
          {this.state.boughtStock && (
            <div>
              you bought {this.state.quantity} shares of{" "}
              {this.state.boughtStock}{" "}
            </div>
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
    user: state.user
  };
};

const mapDispatch = dispatch => {
  return {
    handleBuy(symbol, price, quantity) {
      // e.preventDefault();
      console.log("INSIDE DISPATCH: ", symbol, price, quantity);
      dispatch(buy(symbol, price, quantity));
    },
    updateBalance(id, updatedBalance) {
      dispatch(updateBalance(id, updatedBalance));
    }
  };
};

const Stocks = connect(
  mapState,
  mapDispatch
)(unconnectedStocks);

export default Stocks;
