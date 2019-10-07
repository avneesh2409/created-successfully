import React, { Component, Fragment } from "react";
import './App.css';
import {Redirect} from "react-router-dom"
import axios from "axios";

const url="http://localhost:51937/api/"
class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: ''
    }
   
    this.submithandler = this.submithandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }



  submithandler = () => {
  
    let payload= {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    }
    axios.post(url+'register',payload)
      .then(response => {

        if (response)
          alert("successfully Registered")
        else
          alert("unable to register user with this credentials is already exist")
      })
      .catch(error => {
        console.log(error)
      })

    this.setState({
      name: '',
      password: '',
      email: ''
    })
  }
  render() {
    if(localStorage.getItem('token'))
    {
      alert("you have already registered")
      return(<Redirect to="/home" />)
    }

    return (
      <Fragment>
        <div class="form-wrapper2">
          <form onSubmit={this.submithandler}>
            <h1 className="fw1 text-center">Register here</h1>

            <div class="form-item">
              <input type="text" name="name" onChange={this.handleChange} value={this.state.name} placeholder="Enter your name" required />
            </div>
            <div class="form-item">
              <input type="password" name="password" onChange={this.handleChange} value={this.state.password} placeholder="Enter the password" required />
            </div>
            <div class="form-item">
              <input type="text" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Enter your Email" required />
            </div>
            <div class="button-panel">
              <input type="submit" onClick={this.submithandler} class="button" value="Register" />
            </div>
          </form>
          <div class="reminder">
            <p>Already have an Account <a href="/">Login Now</a></p>
          </div>

        </div>


      </Fragment>

    );

  }

}
export default Registration;
