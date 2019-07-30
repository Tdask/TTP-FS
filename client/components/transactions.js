import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { userTransactions } from "../store";
import { decimalCleaner } from "../helpers";

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
            <ul>
              {items.reverse().map(item => {
                return (
                  <div className="box card" key={item.id}>
                    <div className="card-header">
                      <div className="card-header-title white">
                        {" "}
                        {item.companyName} x {item.quantity}
                      </div>
                      <div className="card-header-icon">
                        <div className="white">
                          Ordered on: {item.createdAt.slice(0, 10)} at:{" "}
                          {item.createdAt.split("T")[1].slice(0, 8)} id#{" "}
                          {item.id}
                        </div>
                        {/* <div> id# {item.id} </div> */}
                      </div>
                    </div>
                    <div>
                      {/* <div> Ordered on: {item.createdAt.slice(0, 10)}</div> */}

                      <div className="card">
                        <div />

                        <section className="padInfo">
                          <div className="text"> Symbol: {item.symbol}</div>
                          <div> Price: {item.price}</div>
                          <div> Quantity: {item.quantity}</div>
                          <div className="title is-5">
                            <strong>
                              Total:{" "}
                              {decimalCleaner(item.price * item.quantity)}
                            </strong>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                );
              })}
            </ul>
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
