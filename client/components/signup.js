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
    this.props.history.push("/portfolio");
  }
  render() {
    return (
      <section className="section">
        <div className="columns is-centered">
          <div className="column has-text-centered is-one-third">
            <h2 className="title is-4">Signup</h2>
            <form className="form" onSubmit={e => this.handleSubmit(e)}>
              <div className="field">
                <div className="control">
                  First Name:{" "}
                  <input className="input" type="text" name="firstName" />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  Last Name:{" "}
                  <input className="input" type="text" name="lastName" />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  Email: <input className="input" type="text" name="email" />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  Password:{" "}
                  <input className="input" type="password" name="password" />
                </div>
              </div>
              <button className="button" type="submit">
                {this.props.displayName}
              </button>
            </form>
          </div>
        </div>
      </section>
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
