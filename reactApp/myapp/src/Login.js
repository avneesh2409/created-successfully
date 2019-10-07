import React, { Component, Fragment } from "react";
import Facebook from './components/Facebook';
import Google from './components/Google';
import './App.css';
import axios from "axios";
import { Redirect } from "react-router-dom";

const url = "http://localhost:51937/api"
let LoggedIn=false
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
    this.submithandler = this.submithandler.bind(this);
    this.onchange = this.onchange.bind(this);

  }
  onchange = (event) => {
    this.setState({
      [event.target.placeholder]: event.target.value
    })

  }

  submithandler(opt) {
    opt.preventDefault()
    let token1=null
    if(localStorage.getItem('token'))
      {
      token1=localStorage.getItem('token')
      }
    let payload = {
      email: this.state.username,
      password: this.state.password,
      token:token1
    }
    if (localStorage.getItem("token")) {
      axios.post(url + '/login',payload).then((response) => {
        if (response) {
          this.setState({
            LoggedIn: true,
          })
        }
        else {
          localStorage.clear();
          console.log("Not authorized Need to login again")
        }
      })
    }
    else {
      let load = {
        email: this.state.username,
        password: this.state.password,
        token:null
      }
      axios.post(url + '/login', load)
        .then(function (response) {
          if (response) {

            localStorage.setItem("token",response.data)
            
              
                LoggedIn=true
          }
          else {
            console("user is not registered")
          }   
          })
        .catch(function (error) {
              console.log("login request failed "+error)
        });
    }

  }


  render() {
    if (LoggedIn) {
      
      return (<Redirect to="/home" />)
    }
    else {
      return (

        <Fragment>


          <div className="container text-center">
            <Facebook /><hr />
            <Google />
          </div>


          <div className="form-wrapper">
            <form onSubmit={this.submithandler}>
              <h1 className="fw1 text-center">Login here</h1>

              <div className="form-item">
                <input type="text" value={this.state.username} onChange={this.onchange} placeholder="username" required />
              </div>

              <div className="form-item">
                <input type="password" onChange={this.onchange} value={this.state.password} placeholder="password" required />
              </div>

              <div className="button-panel">
                <input type="submit" className="button" value="Log In" />
              </div>

            </form>

            <div className="reminder">
              <p>Not a member? <a href="/register">Sign up now</a></p>
              <p><a href="/">Forgot password?</a></p>
            </div>
          </div>

        </Fragment>

      )
    }
  }
}
export default Login;
