import React from 'react'
import  { fetchDocument } from 'tripledoc';
import auth from 'solid-auth-client'
import { ldp, foaf, rdf, schema, vcard, solid, space } from "rdf-namespaces";
import data from "@solid/query-ldflex";
import {width} from "rdf-namespaces/dist/schema";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import GridList from "@material-ui/core/GridList";
import {Grid} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
const FC   = require('solid-file-client')
const fc   = new FC( auth )
const $rdf = require('rdflib')
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');

export default class FriendsInfo extends React.Component {


    constructor(props) {
        super(props);
        this.state = {  webId: null, friends: [], user: null};
        this.webIdNewFriend = this.webIdNewFriend.bind(this);
        this.AddFriendSubmit = this.AddFriendSubmit.bind(this);
        this.rdf = $rdf;
        this.updateManager = new $rdf.UpdateManager(this.store);

    }

    async componentWillMount() {
        await  auth.trackSession(session => {
            if(session){
                this.setState({ webId: session.webId });
                console.log("WEB ID");
                console.log(this.state.webId);
                this.state.user = data[session.webId];
                this.getFriends(this.state.user).then(friends =>this.setState({friends}));
            }
        });
    }

    async getFriends(person) {
        let friendsTemp = [];
        for await (const name of person.friends){
            const webIdDoc = await fetchDocument(name);
            const profile = webIdDoc.getSubject(name);
            let card = {
                'name': profile.getString(foaf.name),
                'firstname': profile.getString(foaf.aimChatID),
                'webId': name,
                'img': profile.getRef(vcard.hasPhoto),
            }
            friendsTemp.push(card);
        }
         return  friendsTemp;
    }

    webIdNewFriend(event) {
        this.setState({value: event.target.value});
    }

    async AddFriendSubmit(event) {
        event.preventDefault();
       await  auth.trackSession(session => {
            if(session){
                let insertions = [];
                let deletions = [];
                try {
                    const doc = $rdf.sym(session.webId.split('#')[0]);
                    const add = $rdf.st($rdf.sym(session.webId), $rdf.sym(FOAF('knows')), $rdf.sym(this.state.value), doc);
                    insertions.push(add);
                    alert("WEB ID "+ this.state.value);
                    this.updateManager.update(deletions, insertions, (uri, success, message) => {
                        if (!success) {
                            console.log('Error: ' + message);
                        }
                    });
                } catch (error) {
                    console.log(`Error adding data: ${error}`);
                }
            }
        });
    }

    async removeFriend ( webId) {
        await  auth.trackSession(session => {
            if(session){
                let insertions = [];
                let deletions = [];
                try {
                    const doc = $rdf.sym(session.webId.split('#')[0]);
                    const add = $rdf.st($rdf.sym(session.webId), $rdf.sym(FOAF('knows')), $rdf.sym(webId), doc);
                    deletions.push(add);
                    alert("AMIGO ELIMANDO   "+ webId);
                    this.updateManager.update(deletions, insertions, (uri, success, message) => {
                        if (!success) {
                            console.log('Error: ' + message);
                        }
                    });
                } catch (error) {
                    console.log(`Error adding data: ${error}`);
                }
            }
        });
    }

    render() {
        const {  friends} = this.state;
        const instance = this;

        return (
            <div>
                <Card variant="outlined">
                        <form onSubmit={this.AddFriendSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={2}>
                                    <InputLabel>AGREGAR NUEVO AMIGO:</InputLabel>
                                </Grid>
                                <Grid item xs={5}>
                                    <Input type="text" value={this.state.value} onChange={this.webIdNewFriend} />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button variant="outlined" color="primary" size="large"  type="submit">AGREGAR</Button>
                                </Grid>
                            </Grid>
                        </form>
                </Card>
            <br/><br/>
            <Card>
                {friends.map(function(friend, index){
                   return <ul key={ index }>
                       <Grid container spacing={3}>
                       <Grid item xs={4}>
                           <img  style={{ height: 100 }} src={friend.img}/>

                       </Grid>
                       <Grid item xs={4}>
                           <InputLabel>{friend.name}</InputLabel>
                           <Link href={friend.webId}>
                               VER PERFIL
                           </Link>

                       </Grid>
                           </Grid>

                            <Button variant="outlined" color="primary" size="large"  onClick={()=> instance.removeFriend(friend.webId.toString())}>ELiminar</Button>

                    </ul>
                })}
            </Card>

            </div>
        )
    }
}
