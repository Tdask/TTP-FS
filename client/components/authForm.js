import React, { Component } from "react";
import { connect } from "react-redux";
import { login, signup } from "../store";
import unconnectedSignup from "./signup";

class AuthForm extends Component {
  componentDidMount() {
    console.log("Props inside authform: ", this.props);
  }
  render() {
    return (
      <div>
        <h2>inside of Login</h2>
        {/* <Signup /> */}
      </div>
    );
  }
}

const mapLogin = state => {
  return {
    name: "login",
    displayName: "Login",
    error: state.user.errror
  };
};

const mapSignup = state => {
  return {
    name: "signup",
    displayName: "Sign Up",
    error: state.user.error
  };
};

// const mapDispatchLogin = dispatch => {
//   return dispatch(login({ email, password }));
// };

const mapDispatch = dispatch => {
  return {
    handleSubmit(e) {
      e.preventDefault();
      const formName = e.target.name;
      const email = e.target.email.value;
      const password = e.target.password.value;
      formName === "signup"
        ? dispatch(
            signup(email, password, e.target.firstName, e.target.lastName)
          )
        : dispatch(login(email, password));
    }
  };
};

export const Login = connect(
  mapLogin,
  mapDispatch
)(AuthForm);
export const Signup = connect(
  mapSignup,
  mapDispatch
)(AuthForm);
