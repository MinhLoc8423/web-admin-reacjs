import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import React, { useState } from 'react';

import Login from './users/Login';
import Add from './news/Add';
import Edit from './news/Edit';
import List from './news/List';
import List1 from './topics/List';
import Add1 from './topics/Add';
import Edit1 from './topics/Edit';
import ResetPassword from './users/ResetPassword';


function App() {

  const getUserFromLocalStorage = () => {
    const userString = localStorage.getItem("user");
    if(userString){
      return JSON.parse(userString);
    }
    return null;
  }

  const saveUserToLocalStorage = (userInfo) => {
    if(!userInfo){
      localStorage.removeItem("user");
      setUser(null);
      return;  
    }
    localStorage.setItem('user', JSON.stringify(userInfo));
    setUser(userInfo);
  }

  const [user, setUser] = useState(getUserFromLocalStorage());

  const ProtectedRoute = () => {
    if(user){
      return <Outlet />
    }
    return <Navigate to="/login" />
  }
 
  const PublicRoute = () => {
    if(user) {
      return <Navigate to="/" />
    }
    return <Outlet />
  }

  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login saveUser={saveUserToLocalStorage} />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<List user={user} saveUser={saveUserToLocalStorage}/>} />
            <Route path="/add" element={<Add user={user} />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/topic" element={<List1 user={user} saveUser={saveUserToLocalStorage} />} />
            <Route path="/addtopic" element={<Add1 user={user} />} />
            <Route path="/edittopic/:id" element={<Edit1 />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
