import React, {Component, useEffect} from "react";
import {Redirect, useHistory} from 'react-router';
import 'jquery'
import 'bootstrap'
import imgAvatar from '../assets/images/people.png'
import style from './LayoutAdmin.css'
import {Link} from "react-router-dom";
import auth from "solid-auth-client";

export default function LayoutAdmin(props) {

    const history = useHistory();

    useEffect(() => {


    }, [])

    const logout = (event) => {
        console.log('logout')
        auth.logout();
        setTimeout(()=>{
            history.push("/")
        }, 1500)


    }
    const heightContent = {
          'height': '1000px',
        };

        return (



            <div>

                <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                    <a className="navbar-brand" href="#">SOLID REACT</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse " id="navbarColor01">
                        <ul className="navbar-nav mr-auto ">

                        </ul>

                        <ul className="nav  navbar-right">
                            <li className="nav-item dropdown ">

                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <img className="image-avatar" src={imgAvatar} />
                                    </a>
                                    <li >
                                        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                            <a className="dropdown-item" href="#" onClick={logout}>Logout</a>
                                        </div>
                                    </li>
                            </li>
                        </ul>





                    </div>


                </nav>

                <div className="row" style={heightContent}>

                    <div className="col-2 navbar-dark bg-primary sidebar">

                        <ul className="menu-admin">
                            <li>
                                <Link to="/home">Home</Link>
                            </li>
                            <li>
                                <Link to="/profile">Profile</Link>
                            </li>
                            <li>
                                <Link to="/show-profile">Show Profile</Link>
                            </li>
                            <li>
                                <Link to="/friends">Friends</Link>
                            </li>
                            <li>
                                <Link to="/posts">Posts</Link>
                            </li>
                            <li>
                                <Link to="/chat">Chat</Link>
                            </li>
                            <li>
                                <Link to="/about">About</Link>
                            </li>
                        </ul>


                    </div>

                    <div className="col-10">

                        <div className="content-panel">



                            {props.children}


                        </div>

                    </div>

                </div>


            </div>
        );


}
