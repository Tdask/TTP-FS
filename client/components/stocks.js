import React, { Component } from "react";
import { connect } from "react-redux";
// import { IEXClient } from "iex-api";
import * as _fetch from "isomorphic-fetch";
// const iex = require("iexcloud_api_wrapper");
import { buy } from "../store";
import axios from "axios";

class Stocks extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      input: [],
      quote: {}
    };
    // this.getSymbols = this.getSymbols.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // const symbolsArr = this.getSymbols();
    // console.log("symbols array: ", symbolsArr);
    this.setState({
      isLoading: false
      // symbolsArr
    });
  }

  handleChange(e) {
    console.log("handle change called");
    console.log(e.currentTarget.value);
    this.setState({
      ...this.state,
      input: e.target.value
    });
  }

  async handleSubmit(e) {
    try {
      e.preventDefault();
      console.log(this.state.input);
      const IEXCLOUD_PUBLIC_KEY = "pk_0b13685b98974e5c9501efc15246a72d";
      const URL =
        process.env.API_URL +
        `/stable/stock/${this.state.input}/quote?token=${IEXCLOUD_PUBLIC_KEY}`;
      // console.log("URL IS: ", URL);

      const res = await axios.get(URL);
      console.log("res.data: ", res.data);
      this.setState({
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
    console.log("QUOTE: ", this.state.quote);
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
          <button type="submit">Search</button>
        </form>
      </div>
    );
  }
}

const mapState = state => {
  return {
    ...state
  };
};

const mapDispatch = dispatch => {
  return {
    handleBuy(symbol, price, quantity) {
      e.preventDefault();
      dispatch(buy(symbol, price, quantity));
    }
  };
};

export default Stocks;
