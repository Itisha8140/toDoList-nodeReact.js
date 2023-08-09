import './App.css';
import Login from './component/login'
import Register from './component/Register';
import Dashbord from './component/Templates/todolist'
import { Routes, Route } from 'react-router-dom'

import '../node_modules/bootstrap/dist/css//bootstrap.css'


function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/Register' element={<Register/>} />
        <Route path='/Dashbord' element={<Dashbord/>} />
      </Routes>
    </>

    // <div>
    //   <Login />
    // </div>
  );
}

export default App;
