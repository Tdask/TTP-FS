import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store";

class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      menu: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState({
      menu: !this.state.menu
    });
  }

  render() {
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item">
            <img src="https://images.emojiterra.com/google/android-oreo/512px/1f4b9.png" />
          </a>
          <h3 className="navbar-item title yellow">Stock App</h3>
          {this.props.isLoggedIn ? (
            <a
              className="navbar-item"
              href="#"
              onClick={this.props.handleClick}
            >
              Logout
            </a>
          ) : (
            <div className="navbar-item">
              <Link className="navbar-item" to="/login">
                <strong>Login</strong>
              </Link>
              <Link className="navbar-item" to="/signup">
                Sign Up
              </Link>
            </div>
          )}
          <a
            onClick={this.toggleMenu}
            role="button"
            className={`navbar-burger burger ${
              this.state.menu ? "is-active" : ""
            }`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>
        <div className={`navbar-menu ${this.state.menu ? "is-active" : ""}`}>
          <div className="navbar-end">
            {this.props.isLoggedIn && (
              <div className="navbar-item">
                <Link className="navbar-item" to="/home">
                  Home
                </Link>

                <Link className="navbar-item" to="/transactions">
                  Transactions
                </Link>
                <Link className="navbar-item" to="/portfolio">
                  Portfolio
                </Link>
              </div>
            )}
          </div>
        </div>
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
