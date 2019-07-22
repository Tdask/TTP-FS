import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store";

class Navbar extends Component {
  componentDidMount() {}
  render() {
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <h3 className="title yellow">Stock App</h3>
        {this.props.isLoggedIn ? (
          <div>
            <div className="navbar-brand">
              <a
                className="navbar-item"
                href="#"
                onClick={this.props.handleClick}
              >
                Logout
              </a>

              <Link className="navbar-item" to="/home">
                Home
              </Link>

              <div className="navbar-end">
                <Link className="navbar-item" to="/transactions">
                  Transactions
                </Link>
                <Link className="navbar-item" to="/portfolio">
                  Portfolio
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="navbar-brand">
            <Link className="navbar-item" to="/login">
              <strong>Login</strong>
            </Link>

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
