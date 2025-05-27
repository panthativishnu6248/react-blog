import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';


const App = () =>{
  const[counter,SetCounter]=useState(0)

  const HandleReload =()=>{
    alert('Reloading')
    window.location.reload();
  };

 

  return (
    
      <div className='App'>
        
        <button onClick={() => SetCounter((prevCount) => prevCount-1)}>-</button>
        <h1>{counter}</h1>
        <button onClick={() => SetCounter((prevCount) => prevCount+1)}>+</button>
        <br></br>
      <button onClick={HandleReload}>CLick here to Reload</button>
      </div>
  );
}

export default App;
