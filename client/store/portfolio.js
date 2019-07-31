import axios from "axios";
import { log } from "util";

const GET_PORTFOLIO = "GET_PORTFOLIO";

const defaultPortfolio = {};

//action
const gotPortfolio = portfolio => ({ type: GET_PORTFOLIO, portfolio });

//thunk

export const getPortfolio = portfolio => dispatch => {
  console.log("INSIDE getPorflio thunk", portfolio);

  dispatch(gotPortfolio(portfolio));
};

//reducer

export default function(state = defaultPortfolio, action) {
  switch (action.type) {
    case GET_PORTFOLIO:
      return {
        portfolio: action.portfolio
      };
    default:
      return state;
  }
}
