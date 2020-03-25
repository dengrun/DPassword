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

  constructor() {
    super();
    this.state = {
      iname: '',
      ipassword: '',

      passList: []
    };
  }

  nameChange(event) {
    this.setState({ iname: event.target.value })
  }
  passChange(event) {
    this.setState({ ipassword: event.target.value })
  }
  fetchData() {
    const options = { decrypt: false }
    userSession.getFile('mypass.json', options)
      .then((file) => {
        var result = JSON.parse(file || '[]')
        console.log(result)
        this.setState({
          passList: result
        })
      })
      .finally(() => {
        console.log("read over")
      })
  }
  saveNewPass(data) {

    let mydata = {
      name: data.name,
      password: data.password,
      created_at: Date.now()
    }

    this.state.passList.push(mydata);

    const options = { encrypt: false }
    userSession.putFile('mypass.json', JSON.stringify(this.state.passList), options)
      .then(() => {
        this.setState({
          list: this.state.passList
        })
      })
  }
  doSubmit(event) {
    let data = {
      name: this.state.iname,
      password: this.state.ipassword
    };

    this.saveNewPass(data);
  }
  render() {
    
    return (
      <div>
        <Header userSession={userSession} />

        <span>名称：</span>
        <input type="text" value={this.state.iusername} onChange={e => this.nameChange(e)}></input>
        <span>密码：</span>
        <input type="password" value={this.state.ipassword} onChange={e => this.passChange(e)}></input>
        <button onClick={e => this.doSubmit(e)}>提交</button>

        <hr></hr>

        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {this.state.passList.map((v, i) =>
              <tr>
                <td>{v.name}</td>
                <td>{v.password}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    );
  }


  componentDidMount() {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        window.history.replaceState({}, document.title, "/")
        this.setState({ userData: userData })
      });
    }

    this.fetchData()
  }
}

