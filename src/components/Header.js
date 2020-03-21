import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

class Header extends Component {
  constructor(props){
    super();

    this.state = {
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
  	};
  }

  login(e) {
    e.preventDefault();
    this.props.userSession.redirectToSignIn();
  }

  logout=()=> {
    this.props.userSession.signUserOut(window.location.origin);
  }

  componentWillMount() {
    if(this.props.userSession.isUserSignedIn()){
      this.setState({
        person: new Person(this.props.userSession.loadUserData().profile),
      });
    }
    
  }
  render() {
    const { person } = this.state;
    return (
      <div>
        <nav className="navbar navbar-dark bg-dark navbar-static-top">
          <a className="navbar-brand" href="https://blockstack.org">
            <img src="white-logo.svg" alt=""></img>
          </a>
          {
            !this.props.userSession.isUserSignedIn() ?
            <button className="btn btn-primary" onClick={this.login.bind(this)}>Login</button>
            : 
            <div>
              
              <div className="form-inline">
              <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" alt=""/>
                <h1 className="text-primary">{ person.name() ? person.name() : 'Nameless Person' }</h1>
                <button className="btn btn-primary" onClick={this.logout}>Logout</button>
              </div>
            </div>
          }
        </nav>
      </div>
    )
  }
}

export default Header;