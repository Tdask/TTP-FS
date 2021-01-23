import React, { Component } from "react";
import { connect } from "react-redux";
import * as _fetch from "isomorphic-fetch";
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
      error: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleBuy = this.handleBuy.bind(this);
    this.renderSuggestions = this.renderSuggestions.bind(this);
    this.selectSuggestion = this.selectSuggestion.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  componentDidUpdate() {
    //make portfolio object here when transactions initially updates..save transactions to local state if props transactions.length is more state transactions.length
    if (
      this.props.transactions.transactions.length >
      this.state.transactions.length
    ) {
      const portfolio = portfolioMaker(this.props.transactions.transactions);
      this.setState({
        transactions: this.props.transactions.transactions,
      });
      //dispatch portfolio thunk here to update redux store...
      this.props.getPortfolio(portfolio);
    }

    if (this.state.input.length > 0) {
      if (this.state.isEmpty) {
        this.setState({
          isEmpty: false,
        });
      }
    }

    if (this.state.input.length === 0 && !this.state.isEmpty) {
      this.setState({
        isEmpty: true,
      });
    }

    if (this.state.isEmpty) {
      if (this.state.quote.symbol) {
        this.setState({
          quote: {},
        });
      }
    }

    //as soon as you start typing, if there was a previous searchedstock in local state clear it
    if (this.state.searchStock) {
      this.setState({
        searchStock: null,
        quantity: 1,
      });
    }

    if (this.state.suggestions.length > 0 && this.state.error) {
      this.setState({
        error: null,
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
      isSearching: true,
      error: null,
    });
    let newTrans = this.props.transactions.transactions.slice();
    newTrans.push({ symbol, latestPrice, quantity });

    const portfolio = portfolioMaker(newTrans);
    this.props.getPortfolio(portfolio);
  }

  handleChange(e) {
    const input = e.target.value;
    let suggestions = [];
    if (input.length > 0) {
      const regex = new RegExp(`^${input}`, "i");
      suggestions = this.props.allSymbols.filter((item) =>
        regex.test(item.symbol)
      );
    }
    this.setState({
      input,
      suggestions,
    });
  }

  handleIncrement(n) {
    const quantity = this.state.quantity;
    const { latestPrice } = this.state.quote;
    const { balance } = this.props;
    const isPos = n > 0;
    if (isPos) {
      if (latestPrice * quantity + latestPrice < balance) {
        this.setState({
          quantity: this.state.quantity + 1,
          error: null,
        });
      }
      if (latestPrice * quantity + latestPrice > balance) {
        this.setState({
          error: "you do not have enough money for more",
        });
      }
    }
    if (!isPos && this.state.quantity > 1) {
      this.setState({
        quantity: this.state.quantity - 1,
        error: null,
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
        suggestions: [],
      });
    } catch (error) {
      console.log(error);
      this.setState({
        error: "Must be a valid ticker symbol",
      });
    }
  }

  renderSuggestions() {
    const { suggestions } = this.state;
    return suggestions ? (
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
    ) : null;
  }

  selectSuggestion(item) {
    this.setState({
      input: item.symbol,
      suggestions: [],
    });
  }

  render() {
    const {
      symbol,
      latestPrice,
      companyName,
      previousClose,
    } = this.state.quote;
    const { userId, balance } = this.props;
    const { quantity, isEmpty } = this.state;
    console.log("state", this.state);
    return (
      <div className="stick">
        <h1 className="title is-2"> Buy stock </h1>

        <div className="box is-one-third">
          <h3 className="title is-3">Balance: ${decimalCleaner(balance)}</h3>
        </div>
        <section className="section">
          <div>
            {this.state.error && (
              <div className="is-size-3 has-text-danger">
                {this.state.error}
              </div>
            )}
          </div>
          <div className="box card is-vcentered">
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="field">
                <div className="control">
                  Search by ticker symbol:
                  <div className="is-fixed">
                    <input
                      className="input"
                      type="text"
                      name="ticker"
                      placeholder="ex: AAPL"
                      onChange={(e) => this.handleChange(e)}
                      value={this.state.input}
                      autoComplete="off"
                    />
                    {this.state.suggestions ? this.renderSuggestions() : null}
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
                  <div className="title is-6">
                    Price: {latestPrice || previousClose}
                  </div>

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
                    Total:{" "}
                    {decimalCleaner(
                      (latestPrice || previousClose) * this.state.quantity
                    )}
                  </div>
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

const mapState = (state) => {
  return {
    balance: state.user.balance,
    userId: state.user.id,
    user: state.user,
    allSymbols: state.stock.symbols,
    transactions: state.transactions,
    portfolio: state.portfolio,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleBuy(symbol, companyName, price, quantity) {
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
    },
  };
};

const Stocks = connect(mapState, mapDispatch)(unconnectedStocks);

export default Stocks;
