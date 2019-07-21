import React, { Component } from "react";
import { connect } from "react-redux";
import { login, signup } from "../store";
// import UnconnectedSignup from "./signup";

class AuthForm extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   isLoggedIn = false
    // }
    this.handleLogin = this.handleLogin.bind(this);
  }
  componentDidMount() {
    // console.log("history inside authform: ", history);
  }

  handleLogin(e) {
    this.props.handleSubmit(e);
    this.props.history.push("/home");
    // this.setState({
    //   isLoggedIn: true
    // });
  }
  render() {
    // if(this.state.isLoggedIn){
    //   return (
    //     <Redirect to="/home"/>
    //   )
    // }
    return (
      <div>
        <h2>{this.props.displayName}</h2>
        <form
          onSubmit={event => this.handleLogin(event)}
          name={this.props.name}
        >
          <div>
            Email:{" "}
            <input type="text" name="email" placeholder="bob@fakemail.com" />
            <br />
            Password: <input type="password" name="password" />
            <button type="submit">{this.props.displayName}</button>
          </div>
        </form>
        <div />
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
      dispatch(login(email, password));
    }
  };
};

export const Login = connect(
  mapLogin,
  mapDispatch
)(AuthForm);
