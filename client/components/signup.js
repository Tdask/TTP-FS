import React, { Component } from "react";
import { connect } from "react-redux";
import { login, signup } from "../store";

const unconnectedSignup = () => {
  return (
    <div>
      <h2>Inside of Signup</h2>
      <input type="text" name="firstName" />;
    </div>
  );
};

export default unconnectedSignup;
