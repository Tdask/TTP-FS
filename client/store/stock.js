import axios from "axios";

//ACTION TYPES
const GET_STOCK = "GET_STOCK";
const BUY_STOCK = "BUY_STOCK";

const defaultStock = {};

//ACTION CREATORS
const getStock = symbol => ({ type: GET_STOCK, symbol });
const buyStock = data => ({ type: BUY_STOCK }, data);

//THUNKS
export const search = symbol => async dispatch => {
  let res;
  try {
    res = await axios.post(`/api/stock/search`, symbol);
    console.log("res: ", res);
  } catch (error) {
    console.log(error);
  }
};

export const buy = (symbol, price, quantity) => async dispatch => {
  let res;
  try {
    res = await axios.post(`/api/stock/buy`, { symbol, price, quantity });
    res.json();
  } catch (error) {
    console.log(error);
  }
};

//REDUCER
export default function(state = defaultStock, action) {
  switch (action.type) {
    case GET_STOCK:
      return action.stock;
    default:
      return state;
  }
}
