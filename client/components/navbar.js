import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store";

class Navbar extends Component {
  componentDidMount() {}
  render() {
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <h3 className="title is-3">Stock App</h3>
        {this.props.isLoggedIn ? (
          <div className="navbar-brand">
            <Link className="navbar-item" to="/home">
              Home
            </Link>{" "}
            |{" "}
            <a href="#" onClick={this.props.handleClick}>
              Logout
            </a>{" "}
            | <Link to="/transactions">Transactions</Link> |{" "}
            <Link to="/portfolio">Portfolio</Link>
          </div>
        ) : (
          <div className="navbar-brand">
            <Link className="navbar-item" to="/login">
              <strong>Login</strong>
            </Link>{" "}
            |{" "}
            <Link className="navbar-item" to="/signup">
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    );
  }
}

const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  };
};

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    }
  };
};

export default connect(
  mapState,
  mapDispatch
)(Navbar);
