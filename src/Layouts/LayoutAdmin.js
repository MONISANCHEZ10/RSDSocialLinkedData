import React, {Component, useEffect} from "react";
import {Redirect, useHistory} from 'react-router';
import 'jquery'
import 'bootstrap'
import imgAvatar from '../assets/images/people.png'
import logo from '../assets/images/logo.png'
import style from './LayoutAdmin.css'
import {Link} from "react-router-dom";
import auth from "solid-auth-client";
import HomeIcon from '@material-ui/icons/Home';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import PhotoAlbumIcon from '@material-ui/icons/PhotoAlbum';
import PostAddIcon from '@material-ui/icons/PostAdd';
import ChatIcon from '@material-ui/icons/Chat';
import InfoIcon from '@material-ui/icons/Info';
import PostManager from "../components/PostManager";
import Col from "react-bootstrap/Col";


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

                <nav className="header-data  navbar-expand-lg navbar-light ">
                    <div className="logo">
                        <Link  to="/home"> <img src={logo} />  </Link>
                    </div>

                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link to="/home"><HomeIcon/>  INICIO </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/profile"><EditOutlinedIcon/> PERFIL</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/show-profile"><AccountBoxIcon/> MI PERFIL</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/friends"><GroupAddIcon/> AMIGOS</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/posts"><PhotoAlbumIcon/> GALERIA</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/postpriv"><PostAddIcon/> PUBLICACIONES</Link>

                        </li>
                                {/* <li className="nav-item">*/}
                                {/* <Link to="/chat"><ChatIcon/> CHAT</Link>*/}
                                {/*</li>*/}

                            <li className="nav-item">
                                <Link to="/about"><InfoIcon/> INFO</Link>
                            </li>
                        </ul>
                        <ul className="nav  navbar-right">
                                <li className="nav-item">
                                    <a  href="#" onClick={logout}>SALIR</a>
                                </li>

                        </ul>
                    </div>
                </nav>

                <div className="container" >
                    <br/> <br/>
                    <div className="col-12 post-comment-box">
                           {props.children}
                    </div>

                </div>
                {/* <footer className=" wrapper footy-sec"></footer>*/}




            </div>
        );


}
