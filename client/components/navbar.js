import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
//still need to make reducers for logout

const Navbar = ({ handleClick, isLoggedIn }) => (
  <div>
    <h1>My Stock Portfolio</h1>
    <nav>{isLoggedIn ? <div>logged in</div> : <div>is not logged in</div>}</nav>
  </div>
);

export default Navbar;

//CONTAINER
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  };
};

// mapDispatch = dispatch => {
//   return {
//     handleClick(){
//       dispatch(logout())
//     }
//   }
// }

//export default connect(mapState)(Navbar);
