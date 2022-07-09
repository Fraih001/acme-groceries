import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { toggle, create, deleteGroc } from './store';

const _Groceries = ({ groceries, view, toggle, create, deleteGroc })=> {
  return (
    <div>
      <button onClick={ create }>Create</button>
      <ul>
        {
          groceries.filter(grocery => !view || ( grocery.purchased && view === 'purchased') ||( !grocery.purchased && view === 'needs') ).map( grocery => {
            return (
              <div>
              <li onClick={ ()=> toggle(grocery)} key={ grocery.id } className={ grocery.purchased ? 'purchased': ''}> { grocery.name } </li>
              <button onClick={()=>{deleteGroc(grocery)}}>X</button>
              </div>
            );
          })
        }
      </ul>
    </div>
  );
};

const mapDispatchToProps = (dispatch)=> {
  return {
    toggle: (grocery)=>{
      dispatch(toggle(grocery));
    }, 
    create: ()=>{
      dispatch(create());
    },
    deleteGroc: (grocery)=>{
      console.log(grocery)
      dispatch(deleteGroc(grocery))
    }
  };
};

const Groceries = connect(state => state, mapDispatchToProps)(_Groceries);

export default Groceries;
