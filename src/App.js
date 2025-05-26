import logo from './logo.svg';
import './App.css';
import { useState } from 'react';


const App = () =>{
  const[counter,SetCounter]=useState(0);

  return (
    
      <div className='App'>
        
        <button onClick={() => SetCounter((prevCount) => prevCount-1)}>-</button>
        <h1>{counter}</h1>
        <button onClick={() => SetCounter((prevCount) => prevCount+1)}>+</button>
        <h1>
          Hey Hi !!!
        </h1>
      </div>
  );
}

export default App;
