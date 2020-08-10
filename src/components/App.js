// @flow
import React from 'react'

import Home from "../pages/Home";
import {Link, Switch, Route, BrowserRouter as Router} from 'react-router-dom'
import Login from "../pages/Login";
import Friends from "../pages/Friends";
import Posts from "../pages/Posts";
import ProfilePage from "../pages/ProfilePage";
import LayoutDefault from "../Layouts/LayoutAdmin";
import LayoutAdmin from "../Layouts/LayoutAdmin";
import LayoutLogin from "../Layouts/LayoutLogin";
import ChatPage from "../pages/ChatPage";
import ShowProfile from "./ShowProfile";



const App = () => (
    <Router>
        <div>

            <Switch>

                <Route path="/chat">
                    <LayoutAdmin >
                        <ChatPage />
                    </LayoutAdmin>
                </Route>

                <Route path="/login">
                    <LayoutLogin >
                        <Login />
                    </LayoutLogin>
                </Route>
                <Route path="/about">
                    <LayoutAdmin>
                        <About />
                    </LayoutAdmin>
                </Route>
                <Route path="/home">
                    <LayoutAdmin>
                        <Home />
                    </LayoutAdmin>
                </Route>
                <Route path="/friends">
                    <LayoutAdmin>
                        <Friends />
                    </LayoutAdmin>
                </Route>
                <Route path="/posts">
                    <LayoutAdmin>
                        <Posts />
                    </LayoutAdmin>
                </Route>
                <Route path="/profile">
                    <LayoutAdmin>
                        <ProfilePage />
                    </LayoutAdmin>
                </Route>
                <Route path="/show-profile">
                    <LayoutAdmin>
                        <ShowProfile />
                    </LayoutAdmin>
                </Route>

                <Route path="/">
                    <LayoutLogin >
                        <Login />
                    </LayoutLogin>
                </Route>

            </Switch>
        </div>
    </Router>
)

function About() {
    return <h2>Proyecto realizado por: Monica Sanchez</h2>;
}


export default App
