import axios from "axios";
// import { auth } from "../../../../Immersive/Async/boilermaker/client/store";

//ACTION TYPES
const GET_USER = "GET_USER";
const REMOVE_USER = "REMOVE_USER";
const UPDATE_BALANCE = "UPDATE_BALANCE";

//INITIAL STATE
const defaultUser = {};

//ACTION CREATORS
const getUser = user => ({ type: GET_USER, user });
const removeUser = () => ({ type: REMOVE_USER });
const updated_balance = balance => ({ type: UPDATE_BALANCE, balance });

//THUNK CREATORS
export const me = () => async dispatch => {
  try {
    const res = await axios.get("/auth/me");
    dispatch(getUser(res.data || defaultUser));
  } catch (error) {
    console.log(error);
  }
};

export const login = (email, password) => async dispatch => {
  let res;
  try {
    res = await axios.post(`/auth/login`, { email, password });
  } catch (authError) {
    return dispatch(getUser({ error: authError }));
  }
  try {
    dispatch(getUser(res.data));
  } catch (error) {
    console.log(error);
  }
};

export const signup = (
  email,
  password,
  firstName,
  lastName
) => async dispatch => {
  let res;
  try {
    res = await axios.post("/auth/signup", {
      email,
      password,
      firstName,
      lastName
    });
  } catch (authError) {
    return dispatch(getUser({ error: authError }));
  }

  try {
    dispatch(getUser(res.data));
  } catch (error) {
    console.log(error);
  }
};

export const logout = () => async dispatch => {
  try {
    await axios.post("/auth/logout");
    dispatch(removeUser());
  } catch (error) {
    console.log(error);
  }
};

export const updateBalance = (id, updatedBalance) => async dispatch => {
  try {
    const res = await axios.put(`/auth/me/${id}`, updatedBalance);
    // console.log("THE RETURNED RESPONSE: ", res);

    dispatch(updated_balance(res.data));
  } catch (error) {
    console.log(error);
  }
};

//REDUCER
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      console.log("GET USER REDUCER", action.user);
      return action.user;
    case REMOVE_USER:
      return defaultUser;
    case UPDATE_BALANCE:
      return {
        ...state,
        balance: action.balance
      };
    default:
      return state;
  }
}
