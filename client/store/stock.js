import axios from "axios";
import { get } from "http";

//ACTION TYPES
const GET_STOCK = "GET_STOCK";
const BUY_STOCK = "BUY_STOCK";
const GET_TRANSACTIONS = "GET_TRANSACTIONS";

const defaultStock = {};

//ACTION CREATORS
const getStock = symbol => ({ type: GET_STOCK, symbol });
const buyStock = data => ({ type: BUY_STOCK, data });
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

export const buy = (symbol, price, quantity) => async dispatch => {
  let res;
  try {
    res = await axios.post(`/api/stock/buy`, {
      symbol,
      price,
      quantity
    });
    console.log("buy res: ", res.data);
    dispatch(buyStock(res.data));
  } catch (error) {
    console.log(error);

    // try {
    //   res = await axios.put(`/auth/me/${userId}`, {
    //     price,
    //     quantity
    //   });
    //   console.log("update res: ", res);
    // } catch (error) {
    //   console.log("update error: ", error);
    // }
  }
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
    default:
      return state;
  }
}
