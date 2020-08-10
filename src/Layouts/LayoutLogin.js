import React, {Component} from "react";
import {Redirect} from 'react-router';
import 'jquery'
import 'bootstrap'
import imgAvatar from '../assets/images/people.png'
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

            <div className="container">

                <div className="d-flex justify-content-center h-100">
                    <div className="card">
                        <div className="card-header">
                            <h3>Sign In</h3>
                            <div className="d-flex justify-content-end social_icon">
                                <span><i className="fab fa-facebook-square"></i></span>
                                <span><i className="fab fa-google-plus-square"></i></span>
                                <span><i className="fab fa-twitter-square"></i></span>
                            </div>
                        </div>
                        <div className="card-body">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
