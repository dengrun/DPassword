import React from 'react';
import './static/css/App.css';
import Header from './components/Header';
import { configure } from 'radiks';
import { User, getConfig } from 'radiks';
import Password from './models/Password.js';
import moment from 'moment'; 

import {
  UserSession,
  AppConfig,
  network
} from 'blockstack';

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig: appConfig })

configure({
  apiServer: 'http://localhost:1260',
  userSession
});

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      iname: '',
      ipassword: '',

      passList: [],

      pass: new Password()
    };
  }

  nameChange(event) {
    this.setState({ iname: event.target.value })
  }
  passChange(event) {
    this.setState({ ipassword: event.target.value })
  }
  async fetchData() {
    // const options = { decrypt: false }
    // userSession.getFile('mypass.json', options)
    //   .then((file) => {
    //     var result = JSON.parse(file || '[]')
    //     console.log(result)
    //     this.setState({
    //       passList: result
    //     })
    //   })
    //   .finally(() => {
    //     console.log("read over")
    //   })

    const fetchresult = await Password.fetchList({});
    console.log(fetchresult);
    let result=[];
    fetchresult.forEach(element => {
      console.log(element.attrs)
      result.push(element.attrs);
    });
    
    this.setState({
      passList: result
    });
  }
  async saveNewPass(data) {

    // let mydata = {
    //   name: data.name,
    //   password: data.password,
    //   created_at: Date.now()
    // }

    // this.state.passList.push(mydata);

    // const options = { encrypt: false }
    // userSession.putFile('mypass.json', JSON.stringify(this.state.passList), options)
    //   .then(() => {
    //     this.setState({
    //       list: this.state.passList
    //     })
    //   })
    let username = JSON.parse(localStorage.getItem('blockstack-session')).userData.username;
    let today = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    let pass = new Password({
      owner: username,
      title: data.name,
      password: data.password,
      create_time: today,
      update_time: today
    });

    await pass.save();
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
              <th>Create time</th>
              <th>Update time</th>
            </tr>
          </thead>
          <tbody>
            {this.state.passList.map((v, i) =>
              <tr>
                <td>{v.title}</td>
                <td>{v.password}</td>
                <td>{v.create_time}</td>
                <td>{v.update_time}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    );
  }


  async componentDidMount() {
    if (userSession.isSignInPending()) {
      await userSession.handlePendingSignIn().then((userData) => {
        console.log(userData);

        window.history.replaceState({}, document.title, "/")
        this.setState({ userData: userData })
      });
    }
    const currentUser = await User.createWithCurrentUser();

    this.fetchData()
  }
}

