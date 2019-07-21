import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { userTransactions } from "../store";
import transaction from "../store/transaction";

class unconnectedPortfolio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portfolio: {}
    };
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

    // portfolio = transactions.map(trans => {
    //   console.log("trans inside map function: ", trans);
    // });
    // console.log("portfolio array: ", portfolio);
  }

  render() {
    console.log("local state: ", this.state);
    const { portfolio } = this.state;
    const symbolArr = Object.keys(portfolio);
    console.log(symbolArr);
    return (
      <div>
        <h2>My Portfolio</h2>
        <div>
          {symbolArr.map(item => (
            <div key={item}>
              symbol: {item} quantity: {portfolio[item].quantity}
            </div>
          ))}
        </div>
      </div>
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
