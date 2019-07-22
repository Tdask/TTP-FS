import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { userTransactions } from "../store";

class unconnectedTransactions extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const trans = this.props.getTransactions();
  }

  render() {
    const items = this.props.transactions.transactions;
    console.log("ITEMS: ", items);
    return (
      <section className="section">
        <div className="columns is-centered">
          <div className="column has-text-centered is-half">
            <h1 className="title is-2">My Transactions</h1>
            {items.reverse().map(item => {
              return (
                <div className="outline" key={item.id}>
                  <h4>
                    Stock: {item.symbol}
                    <br /> Quantity of: {item.quantity}
                    <br /> Price at: {item.price} <br /> Transaction Total:{" "}
                    {item.price * item.quantity} <br /> Date: {item.createdAt}
                  </h4>
                </div>
              );
            })}
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

const Transactions = connect(
  mapState,
  mapDispatch
)(unconnectedTransactions);

export default Transactions;
