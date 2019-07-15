import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import { Login, Signup } from "./components";

class Routes extends Component {
  render() {
    return (
      <div>
        <Login />
      </div>
    );
  }
}

export default Routes;
