import axios from "axios";
import { get } from "http";

const IEXCLOUD_PUBLIC_KEY = "pk_0b13685b98974e5c9501efc15246a72d";

//ACTION TYPES
const GET_STOCK = "GET_STOCK";
const BUY_STOCK = "BUY_STOCK";
const GET_SYMBOLS = "GET_SYMBOLS";
// const GET_TRANSACTIONS = "GET_TRANSACTIONS";

const defaultStock = {};

//ACTION CREATORS
const getStock = symbol => ({ type: GET_STOCK, symbol });
const buyStock = data => ({ type: BUY_STOCK, data });
const gotSymbols = symbols => ({ type: GET_SYMBOLS, symbols });
// const getTransactions = userId => ({ type: GET_TRANSACTIONS }, userId);

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

export const buy = (symbol, companyName, price, quantity) => async dispatch => {
  let res;
  try {
    res = await axios.post(`/api/stock/buy`, {
      symbol,
      companyName,
      price,
      quantity
    });
    console.log("buy res: ", res.data);
    //do we need to dispatch an action to update store? wha
    // dispatch(buyStock(res.data));
  } catch (error) {
    console.log(error);
  }
};

export const getSymbols = () => async dispatch => {
  let res;
  try {
    const URL =
      process.env.API_URL +
      `stable/ref-data/symbols?token=${IEXCLOUD_PUBLIC_KEY}`;
    res = await axios.get(URL);
    dispatch(gotSymbols(res.data));
  } catch (error) {}
};

// export const userTransactions = userId => async dispatch => {
//   let res;
//   try {
//     res = await axios.get(`/api/stock/transactions`, userId);
//     console.log("userTransactions res: ", res);
//   } catch (error) {
//     console.log(error);
//   }
// };

//REDUCER
export default function(state = defaultStock, action) {
  switch (action.type) {
    case GET_STOCK:
      return action.symbol;
    case BUY_STOCK:
      return action.data;
    case GET_SYMBOLS:
      return {
        ...state,
        symbols: action.symbols
      };
    default:
      return state;
  }
}
