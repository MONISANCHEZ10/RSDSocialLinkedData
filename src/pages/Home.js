import React from 'react'
import Container from "@material-ui/core/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/cjs/Row";
import MyProfile from "../components/Home/MyProfile";
import MyPosts from "../components/Home/MyPosts";
import MyFriends from "../components/Home/MyFriends";
import PostManager from "../components/PostManager";
import FriendsInfo from "../components/FriendsInfo";



const Home = () => (
    <div>
        <Row>
            <Col className="col-3">
                <MyProfile/>
                <MyPosts/>
            </Col>
            <Col className="col-6">
                AMIGOS
                <FriendsInfo />
                ACTIVIDAD RECIENTE MIS AMIGOS
                <MyFriends/>

            </Col>
            <Col className="col-3">
                <PostManager/>
            </Col>
        </Row>

    </div>
)

export default Home
