import React from "react";
import { connect } from "react-redux";

const Home = props => {
  const { firstName } = props;
  return (
    <div>
      <h2>Welcome, {firstName}</h2>
    </div>
  );
};

const mapState = state => {
  return {
    firstName: state.user.firstName
  };
};

export default connect(mapState)(Home);
