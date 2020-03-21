import React from 'react';
import './static/css/App.css';
import Header from './components/Header';

import {
  UserSession,
  AppConfig
} from 'blockstack';

const appConfig = new AppConfig()
const userSession = new UserSession({ appConfig: appConfig })

export default class App extends React.Component {


  render() {
    return (
      <div>
        <Header userSession={userSession}/>
        {
          userSession.isUserSignedIn() ?
          <p>登录成功</p>
          : <p>请登录</p>
        }
      </div>
      
    );
  }
  
  componentDidMount() {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        window.history.replaceState({}, document.title, "/")
        this.setState({ userData: userData})
      });
    }
  }
}

