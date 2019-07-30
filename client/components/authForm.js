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

  componentDidUpdate() {
    console.log("props inside of component did update: ", this.props);
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
    console.log("PROPS INSIDE AUTHFORM RENDER", this.props);
    return (
      <section className="section">
        <div className="columns is-centered">
          <div className="column has-text-centered is-one-third">
            <h2 className="title is-4">{this.props.displayName}</h2>

            <form
              onSubmit={event => this.handleLogin(event)}
              name={this.props.name}
              className="form"
            >
              <div className="field">
                <div className="control">
                  Email:{" "}
                  <input
                    className="input"
                    type="email"
                    name="email"
                    placeholder="bob@fakemail.com"
                  />
                </div>
              </div>
              <br />
              <div className="field">
                <div className="control">
                  Password:{" "}
                  <input className="input" type="password" name="password" />
                </div>
              </div>
              <div>
                {this.props.error && (
                  <div> {this.props.error.response.data}</div>
                )}
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

const mapLogin = state => {
  return {
    name: "login",
    displayName: "Login",
    error: state.user.error
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
