import React, {Component} from "react";
import {Redirect} from 'react-router';
import 'jquery'
import 'bootstrap'
import imgLogin from '../assets/images/login-icon.png'
import logo from '../assets/images/logo.png'
import './../assets/css/login.css'

export default class LayoutLogin extends Component {

    constructor(props){
        super(props)
    }

    logout(){
        this.setState({
            isLogout:true
        })
    }

    render(){

        return (

            <div className="container  ">
<div className="login-dt footy-sec">
                <h4 className="text-center">BIENVENIDO </h4>

                <div className="wrapper fadeInDown">
                    <div id="formContent">

                        <div className="fadeIn first">
                            <img src={logo} id="icon" alt="User Icon"/>
                        </div>


                        <form>

                            {this.props.children}
                            {/*<input type="text" id="login" className="fadeIn second" name="login" placeholder="login" />*/}
                            {/*    <input type="text" id="password" className="fadeIn third" name="login"*/}
                            {/*           placeholder="password" ></input>*/}
                            {/*    <input type="submit" className="fadeIn fourth" value="Log In" ></input>*/}
                        </form>


                        <div id="formFooter">
                            {/*<a className="underlineHover" href="#">Forgot Password?</a>*/}
                        </div>

                    </div>

            </div>

            </div>
            </div>
        );
    }

}
