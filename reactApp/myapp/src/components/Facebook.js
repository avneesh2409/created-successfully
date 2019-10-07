import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
import {Redirect} from "react-router-dom";

const url = "http://localhost:51937/api"
let LoggedIn=false
class Facebook extends Component {
  constructor() {
    super();
 
    this.responseFacebook = this.responseFacebook.bind(this);

  }
 responseFacebook = (response) => {
   let token1=null
    let payload = {
      name: response.name,
      password: response.accessToken,
      email: response.id
    }
    if (response) {
      axios.post(url + '/register', payload)
        .then((register) => {
          console.log(register);
          if (register) {
            if(localStorage.getItem('token'))
            {
              token1=localStorage.getItem('token')
            }
            let load = {
              email: response.id,
              password: response.accessToken,
              token:token1
            }
            axios.post(url + '/login', load)
              .then(function (response) {
                if (response) {
                  localStorage.setItem("token", JSON.stringify({"token":response}))
                  LoggedIn=true
                }
                else{
                  console.log("user is not registered need to log in again")
                }
              })
              .catch(function (error) {
                console.log('token request failed' + error);
              });
          }
          else {
            console("unable to register")
          }
        })
        .catch(function (error) {
          console.log('user request failed' + error);
        });


    }
    else {
      console.log("unable to fetch data")
    }

  }


  render() {
    if(LoggedIn)
    {
     return( <Redirect to="/home" />)
    }
    return (<FacebookLogin
      appId="422443185136180"
      onFailure={this.responseFacebook}
      autoLoad={false}
      cookie={true}
      callback={this.responseFacebook}
      cssClass="form-wrapper1"
      icon="fa-facebook"
    />
    );

  }
}
export default Facebook;

