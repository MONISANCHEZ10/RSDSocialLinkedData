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

        <Container>
        <Row>
            <Col>
                <MyProfile/>
                <MyPosts/>
            </Col>
            <Col>
                AMIGOS

                <FriendsInfo />
                <br/> <br/>
                ACTIVIDAD RECIENTE MIS AMIGOS
                <MyFriends/>

            </Col>
            <Col>
                <PostManager/>
            </Col>
        </Row>
    </Container>
    </div>
)

export default Home
