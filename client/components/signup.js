import React, { Component } from "react";
import { connect } from "react-redux";
import { login, signup } from "../store";

class UnconnectedSignup extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    this.props.handleSubmit(e);
    this.props.history.push("/home");
  }
  render() {
    return (
      <div className="columns is-centered">
        <div className="column has-text-centered-is-one-third">
          <h2 className="title is-4">Signup</h2>
          <form className="form" onSubmit={e => this.handleSubmit(e)}>
            First Name: <input type="text" name="firstName" />
            <br />
            Last Name: <input type="text" name="lastName" />
            <br />
            Email: <input type="text" name="email" />
            <br />
            Password: <input type="password" name="password" />
            <br />
            <button type="submit">{this.props.displayName}</button>
          </form>
        </div>
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
