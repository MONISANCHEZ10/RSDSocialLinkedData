// @flow
import React from 'react'

import auth from "solid-auth-client";
//import ProfileCard from "../Domain/ProfileCard";

export default class PersonalInfo extends React.Component {
      constructor(props) {
        super(props);
        this.state = {webId: null, profileCard: ProfileCard = new ProfileCard()};
    }

    componentWillMount() {
        auth.trackSession(session => {
            if(session){
                this.setState({ webId: session && session.webId });
                console.log(this.state.webId);
                this.loadProfile();
            }
        });
    }

    loadProfile() {
        this.profileCard.name = "moni";

        console.log(this.profileCard);
    }

    render() {
        const { profileCard } = this.state
        return (
            <p>
                PROFILE.JS COMPONENT:
                { profileCard }
            </p>
        )
    }
}
