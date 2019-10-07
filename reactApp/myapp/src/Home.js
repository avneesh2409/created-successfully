import React, { Fragment } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Redirect } from "react-router-dom";
function Home(props) {
if (localStorage.getItem('token')) {

      return (
        <Fragment>
          <h1 className="form-wrapper" >We Welcome you</h1>
        </Fragment>
      )
    }
    else {
      return (<Redirect to="/" />)
    }
 
}

export default Home;

