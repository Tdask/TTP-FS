import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store";

class Navbar extends Component {
  componentDidMount() {}
  render() {
    return (
      <div>
        <h5>Stock App</h5>
        {/* <div>This is the nav bar</div> */}
        <nav>
          {this.props.isLoggedIn ? (
            <div>
              <div>you are logged in!</div>
              <Link to="/home">Home</Link> |{" "}
              <a href="#" onClick={this.props.handleClick}>
                Logout
              </a>{" "}
              | <Link to="/transactions">Transactions</Link>
            </div>
          ) : (
            <div>
              <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
            </div>
          )}
        </nav>
      </div>
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
