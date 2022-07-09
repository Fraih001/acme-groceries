import React, { Component } from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import axios from 'axios';
import Nav from './Nav';
import store, { setView, bootStrap } from './store';
import Groceries from './Groceries';
import CreateForm from './CreateForm';



class _App extends Component{
  componentDidMount(){
    this.props.bootstrap();
    window.addEventListener('hashchange', ()=> {
      this.props.setView(window.location.hash.slice(1));
    })
    this.props.setView(window.location.hash.slice(1));
  }
  render(){
    const { groceries, view } = this.props;
    return (
      <div>
        <h1>Acme Groceries</h1>
        <Nav />
        <CreateForm />
        <Groceries />
      </div>
    );
  }
}

const App = connect(
  state => state,
  (dispatch)=> {
    return {
      setView: (view)=> dispatch(setView(view)), 
      bootstrap: ()=> {
        dispatch( bootStrap() )
      } 
    }
  }
)(_App);


render(<Provider store={ store }><App /></Provider>, document.querySelector('#root'));
