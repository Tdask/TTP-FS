import React, { Component } from "react";
import { connect } from "react-redux";
import { login, signup } from "../store";

class UnconnectedSignup extends Component {
  render() {
    console.log("props inside of signup: ", this.props);
    return (
      <div>
        <h2>Inside of Signup</h2>
        <form onSubmit={this.props.handleSubmit}>
          First Name: <input type="text" name="firstName" />
          <br />
          Last Name: <input type="text" name="lastName" />
          <br />
          Email: <input type="text" name="email" />
          <br />
          Password: <input type="text" name="password" />
          <br />
          <button type="submit">{this.props.displayName}</button>
        </form>
      </div>
    );
  }
}

const mapSignup = state => {
  return {
    name: "signup",
    displayName: "Sign Up",
    error: state.user.error
  };
};

const mapDispatch = dispatch => {
  return {
    handleSubmit(e) {
      e.preventDefault();
      const formName = e.target.name;
      const firstName = e.target.firstName.value;
      const lastName = e.target.lastName.value;
      const email = e.target.email.value;
      const password = e.target.password.value;
      dispatch(signup(email, password, firstName, lastName));
    }
  };
};

export const Signup = connect(
  mapSignup,
  mapDispatch
)(UnconnectedSignup);
