import React, { Component } from "react";
import { connect } from "react-redux";
import { IEXClient } from "iex-api";
import * as _fetch from "isomorphic-fetch";

class Stocks extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      input: []
    };
    this.getSymbols = this.getSymbols.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const symbolsArr = this.getSymbols();
    console.log("symbols array: ", symbolsArr);
    this.setState({
      isLoading: false,
      symbolsArr
    });
  }

  handleChange(e) {
    console.log("handle change called");
    console.log(e.currentTarget.value);
    // this.setState({
    //   ...this.state,
    //   input: e.target.value
    // });
  }

  async handleSubmit(e) {
    event.preventDefault();
    console.log("you called handleSubmit", e);
  }

  async getSymbols() {
    const iex = new IEXClient(_fetch);
    const symbols = await iex.symbols();
    return symbols.map(stock => stock.symbol);
  }
  render() {
    const { symbolsArr } = this.state;
    return (
      <div className="outline">
        <div>{symbolsArr && <div> {symbolsArr[3]}</div>}</div>
        <form>
          Stock:{" "}
          <input
            type="text"
            name="ticker"
            placeholder="ex: AAPL"
            onChange={e => this.handleChange(e)}
          />
          {/* <input type=" " /> */}
          <input type="submit" onSubmit={e => this.handleSubmit(e)} />
        </form>
      </div>
    );
  }
}

export default Stocks;
