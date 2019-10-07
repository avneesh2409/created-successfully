import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import axios from "axios";
import {Redirect} from "react-router-dom";

const url = "http://localhost:51937/api"
let LoggedIn=false
class Google extends Component {
  constructor() {
    super();
    this.responseGoogle = this.responseGoogle.bind(this);
  }
  
  responseGoogle = (response) => {
    console.log(response);
    let load={
      name:response.w3.ig,
      password:response.googleId,
      email:response.w3.U3
    }

    if (response) {
      let token1=null
      axios.post(url + '/register', load)
        .then((register) => {
          console.log(register);
          if (register) {
            if(localStorage.getItem('token'))
            {
              token1=localStorage.getItem('token')
            }
            let payload = {
              token: token1,
              password: response.accessToken,
              email: response.id
            }
            axios.post(url + '/login', payload)
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
      return(
        <Redirect to="/home" />
      )
    }
    else{
    return (
      <GoogleLogin
        clientId="1043154988937-6vabd9lmgu4rathit7cgfqu3mtfn1tf6.apps.googleusercontent.com"
        buttonText="Google Login"
        className="form-wrapper1"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
        autoLoad={false}
      />

    );
    }
  }
}
export default Google;