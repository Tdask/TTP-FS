const GET_TRANSACTIONS = "GET_TRANSACTIONS";
import axios from "axios";

const defaultTransactions = {
  transactions: []
};

//action
const getTransactions = data => ({ type: GET_TRANSACTIONS, data });

//THUNK
export const userTransactions = () => async dispatch => {
  let res;
  try {
    res = await axios.get(`/api/stock/transactions`);
    console.log("userTransactions res: ", res.data);
    dispatch(getTransactions(res.data));
  } catch (error) {
    console.log(error);
  }
};

//REDUCER
export default function(state = defaultTransactions, action) {
  switch (action.type) {
    case GET_TRANSACTIONS:
      return {
        transactions: [...action.data]
      };
    default:
      return state;
  }
}