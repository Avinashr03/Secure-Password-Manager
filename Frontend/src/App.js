import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Landing';
import AddUser from './components/header';
import VerifyPassword from './components/Verfiypassword';
import SearchUsername from './components/Searchusername';
import PasswordStrengthChecker from './components/passwordaccess';
import GeneratePassword from './components/Generatepassword';
import Signup from './components/Signup';
import Login from './components/Login';
import Job from './components/Santhosh';
import Deep from './components/Sandlogin';
import JobSignup from './components/Jobsignup';
import JobLogin from './components/Joblogin';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/mainhome" element={<Home />} />
        <Route path="/add_user" element={<AddUser />} /> 
        <Route path="/login" element={<Login/>} />
        <Route path="/verify_password" element={<VerifyPassword />} />
        <Route path="/search_username" element={<SearchUsername />} />
        <Route path="/password_strength" element={<PasswordStrengthChecker />} />
        <Route path="/generate_password" element={<GeneratePassword />} />
      </Routes>
    </Router>
  );
};

export default App;
