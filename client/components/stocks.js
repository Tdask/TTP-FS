import React, { Component } from "react";
import { connect } from "react-redux";
// import { IEXClient } from "iex-api";
import * as _fetch from "isomorphic-fetch";
// const iex = require("iexcloud_api_wrapper");
import { buy, updateBalance } from "../store";
import axios from "axios";

class unconnectedStocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      input: [],
      quote: {},
      quantity: 1,
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
    console.log("props iside of STOCKS: ", this.props);
    this.setState({
      isLoading: false
      // symbolsArr
    });
  }

  handleBuy(symbol, latestPrice, quantity) {
    console.log("made it inside: ", symbol, latestPrice, quantity);
    let newBalance = this.props.balance - latestPrice * quantity;
    this.props.handleBuy(symbol, latestPrice, quantity);
    this.props.updateBalance(this.props.userId, newBalance);
    // this.props.history.push("/transactions");
  }

  handleChange(e) {
    console.log("handle change called");
    console.log(e.currentTarget.value);
    this.setState({
      // ...this.state,
      input: e.target.value
    });
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
    // else if (this.state.quantity > 1) {
    //     this.setState({
    //       quantity: this.state.quantity + n
    //     });
    //   }
    //}
    // if (n < 0 && this.state.quantity > 1) {
    //   this.setState({
    //     quantity: this.state.quantity--
    //   });
    // }
    // if (n > 0) {
    //   this.setState({
    //     quantity: this.state.quantity++
    //   });
    // }
  }

  async handleSubmit(e) {
    try {
      e.preventDefault();
      console.log(this.state.input);
      const IEXCLOUD_PUBLIC_KEY = "pk_0b13685b98974e5c9501efc15246a72d";
      const URL =
        process.env.API_URL +
        `stable/stock/${this.state.input}/quote?token=${IEXCLOUD_PUBLIC_KEY}`;

      console.log("URL: ", URL);

      const res = await axios.get(URL);
      console.log("res.data: ", res.data);
      this.setState({
        ticker: this.state.input,
        quote: res.data
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
    // console.log("STATE: ", this.state);
    const { symbol, latestPrice, companyName } = this.state.quote;
    console.log("symbol:", symbol);
    const { userId } = this.props;
    const { quantity } = this.state;
    // console.log("PROPSSSS: ", this.props);
    return (
      <div className="outline">
        {/* <div>{symbolsArr && <div> {symbolsArr[3]}</div>}</div> */}
        <form onSubmit={this.handleSubmit}>
          Stock:{" "}
          <input
            type="text"
            name="ticker"
            placeholder="ex: AAPL"
            onChange={e => this.handleChange(e)}
          />
          {/* <input type=" " /> */}
          <button type="submit" className="button">
            Search
          </button>
        </form>
        <div>
          {symbol && (
            <div>
              <div>Company:{companyName}</div>
              <div>Price: {latestPrice}</div>
              <span>
                <button onClick={() => this.handleIncrement(-1)}>-</button>
                <div> Qnty: {this.state.quantity}</div>
                <button onClick={() => this.handleIncrement(1)}>+</button>
                <div>Total: {latestPrice * this.state.quantity}</div>
                <br />
                <div>{this.state.error && <div>{this.state.error}</div>}</div>
                <button
                  onClick={() => {
                    this.handleBuy(symbol, latestPrice, quantity);
                  }}
                >
                  Buy
                </button>
              </span>
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
