import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';

// const initialState = {
//   groceries: [],
//   view: ''
// };

const viewReducer = (state = "", action)=> {
  if(action.type === 'SET_VIEW'){
    return action.view;
  }
  return state;
};

const groceriesReducer = (state = [], action)=> {
  if(action.type === 'LOAD'){
    return action.groceries
  }
  if(action.type === 'UPDATE'){
    return state.map(grocery => grocery.id === action.grocery.id ? action.grocery : grocery )};
  if(action.type === 'CREATE'){
    return [...state, action.grocery ]
  }
  if(action.type === 'DELETE') {
    return state.filter(grocery => grocery.id !== action.grocery.id)
  }
  return state;
}

const reducer = combineReducers({
  view: viewReducer,
  groceries: groceriesReducer
})

const deleteGroc = (grocery) => {
  return async(dispatch) => {
   await axios.delete(`/api/groceries/${grocery.id}`)
    dispatch({ type: 'DELETE', grocery})
  }
}

const toggle = (grocery) => {
  return async(dispatch) => {
    const updated = (await axios.put(`/api/groceries/${grocery.id}`, { purchased: !grocery.purchased })).data;
    dispatch({ type: 'UPDATE', grocery: updated});
  }
}

const create = () => {
  return async(dispatch) => {
    const grocery = (await axios.post('/api/groceries/random')).data;
    dispatch({ type: 'CREATE', grocery });
  }
}

const createForm = (name) => {
  return async(dispatch) => {
    const grocery = (await axios.post('/api/groceries', { name })).data;
    dispatch({ type: 'CREATE', grocery });
  }
}

const setView = (view) => {
  return async(dispatch) => {
    dispatch({ type: 'SET_VIEW', view })
  }
}

const bootStrap = () => {
  return async(dispatch) => {
    const groceries = (await axios.get('/api/groceries')).data;
        dispatch({
          type: 'LOAD',
          groceries
        })
  }
}

const store = createStore(reducer, applyMiddleware(logger, thunk))

export default store;
export { toggle, create, createForm, setView, bootStrap, deleteGroc };


