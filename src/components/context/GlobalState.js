import axios from 'axios';
import React, { createContext, useReducer } from 'react';
import { appReducer } from './AppReducer';

//Initial State
const initialState = {
  transactions: [],
  error: null,
  loading: true,
};

//Create Context

export const GlobalContext = createContext(initialState);

//Provider Component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  //Actions
  const getTransactions = async () => {
    try {
      const res = await axios.get('api/v1/transactions');

      dispatch({
        type: 'GET_TRANSACTIONS',
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error,
      });
    }
  };

  const deleteTransaction = async id => {
    try {
      await axios.delete(`api/v1/transactions/${id}`);
      dispatch({
        type: 'DELETE_TRANSACTION',
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error,
      });
    }
  };

  const addTransaction = async transaction => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = await axios.post('api/v1/transactions', transaction, config);

      dispatch({
        type: 'ADD_TRANSACTION',
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error,
      });
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        error: state.error,
        loading: state.loading,
        getTransactions,
        deleteTransaction,
        addTransaction,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};
