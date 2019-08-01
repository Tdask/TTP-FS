const GET_PORTFOLIO = "GET_PORTFOLIO";

const defaultPortfolio = {};

//action
const gotPortfolio = portfolio => ({ type: GET_PORTFOLIO, portfolio });

//thunk

export const getPortfolio = portfolio => dispatch => {
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
