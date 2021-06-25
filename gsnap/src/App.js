import React, { Component } from 'react'
import {
  Route, BrowserRouter as Router, Switch
} from 'react-router-dom';
import Home from './Components/Home/home';
import Profile from './Components/Profile/profile';
import SidePanel from './Components/SidePanel/sidePanel';
import Signin from './Components/Signin/signin';
import Signup from './Components/Signup/signup';
import { toast, ToastContainer } from 'react-toastify';

class App extends Component {
  showToast = (type, message) => {
    switch (type) {
      case 0:
        toast.warning(message)
        break;
      case 1:
        toast.success(message)
        default:
        break;
    }
  }
  render() {
    return (
      <>
        <Router>
          <ToastContainer
            autoClose={2000}
            hideProgressBar={true}
            position={toast.POSITION.TOP_CENTER}
          />
          <Switch>
            <Route
              exact
              path="/"
              render={props => <Home{...props} />}
            />
            <Route
              exact
              path="/signin"
              render={props => <Signin showToast={this.showToast} {...props} />}
            />
             <Route
              exact
              path="/signup"
              render={props => <Signup showToast={this.showToast} {...props} />}
            />
             <Route
              exact
              path="/profile"
              render={props => <Profile showToast={this.showToast} {...props} />}
            /> 
              <Route
              exact
              path="/chat"
              render={props => <SidePanel showToast={this.showToast} {...props} />}
            />
          </Switch>
        </Router>
      </>
    );
  };
};

export default App;