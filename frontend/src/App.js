import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Switch,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Users from "./components/Users";
import UsersComponent from "./components/Users";
// import Navigation from "./components/Nav";
// import dotenv from "dotenv"
// dotenv.config()

const App = () => {
  return (
    <div>
     {/* <Navigation/> */}
      <Router>
        <Routes>
          <Route exact path="/" element={<Login/>} />
          <Route exact path="/register" element={<Register/>} />
          <Route exact path="/tasks" element={<Home/>} />
          <Route exact path="/users" element={<UsersComponent/>} />
          
        </Routes>
      </Router>
    </div>
  );
};

export default App;
