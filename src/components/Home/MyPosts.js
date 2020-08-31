import React from 'react'
import  { fetchDocument, createDocument } from 'tripledoc';
import auth from 'solid-auth-client'
import { ldp, foaf, rdf, schema, vcard, solid, space } from "rdf-namespaces";
import {Grid} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import ImageUploading from "react-images-uploading";
const $rdf = require('rdflib')
const FC   = require('solid-file-client')
const fc   = new FC( auth )
import * as session from "solid-auth-cli";
import data from "@solid/query-ldflex";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import PostsHelpers from "../../lib/PostsHelpers";
import VisibilityIcon from '@material-ui/icons/Visibility';
import NativeSelect from "@material-ui/core/NativeSelect";
import TurnedInIcon from '@material-ui/icons/TurnedIn';


export default class MyPosts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {  webId: null, notes: [], notesList: null, notesListRef: null, image: null, fileImage: null , photo: "", friends: [],
            user: null, value:'', setValue:'' } ;
        this.textPost = this.textPost.bind(this);
        this.AddPostSubmit = this.AddPostSubmit.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.rdf = $rdf;
        this.updateManager = new $rdf.UpdateManager(this.store);
    }



    async  componentWillReceiveProps(nextProps) {
        console.log("WILL MOUNT...")
        const { webId } = this.props
        if (nextProps.webId !== "" && webId !== nextProps.webId) {
            this.setState({ webId: session.webId });
            console.log("WEB ID ----:" + this.state.webId);
            PostsHelpers.getPosts2(this.state.webId).then(notes =>this.setState({notes}));

        }



    }
    async  componentDidMount(nextProps) {
        console.log("DID MOUNT...")
        await  auth.trackSession(session => {
            if(session){
                this.setState({ webId: session.webId });
                console.log("WEB ID :" + this.state.webId);
                this.state.user = data[this.state.webId];

                PostsHelpers.getPosts2(this.state.webId).then(notes =>this.setState({notes}));

            }
        });
    }

    textPost(event){
        this.setState({value: event.target.value});
    }

    async AddPostSubmit(event) {
        event.preventDefault();
        console.log("event")
        console.log(event.target)
        await PostsHelpers.addNote(this.state.webId, this.state.value, this.state.fileImage);
        this.setState({  value: ''})
        PostsHelpers.getPosts2(this.state.webId).then(notes =>this.setState({notes}));
    }

    async  deleteNote(note) {
        let noteFile = note.getString(schema.additionalName)
        await fc.deleteFile(noteFile)
        if(note.getRef(schema.image) !== null){
            console.log("ELIMINANDO MAGEN")
            let noteImage = note.getRef(schema.image)
            await fc.deleteFile(noteImage)
        }
        return PostsHelpers.getPosts2(this.state.webId).then(notes =>this.setState({notes}));

    }

    async onChange  (imageList) {
        console.log("IMAGE ....")
        this.state.fileImage = imageList[0] === undefined? null : imageList[0]
    };

    onError  (errors, files) {
        console.log(errors, files);
    };

    async  handleChange  (event)  {
        let doc = event.target.name;
        let level = event.target.value;
        await PostsHelpers.changeAccess(doc, level);
        return PostsHelpers.getPosts2(this.state.webId).then(notes =>this.setState({notes}));
    };

    render() {
        const {  notes} = this.state;
        const instance = this;


        return (
            <div>
                <br/>

                    {notes.map(function(note, index){
                        note.value  = note.getString(schema.publicAccess);
                        return <Card key={ index } style={{ maxWidth: 245}} >
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="recipe" ><TurnedInIcon/> </Avatar>
                                }
                              //  title={note.getString(schema.additionalName)}
                                subheader={ note.getString(schema.dateCreated)}
                            />
                            {note.getRef(schema.image) !== null &&
                            <CardMedia
                                style={{height: 0, paddingTop: '46.25%'}}
                                image={note.getRef(schema.image)}
                                title="Paella dish"
                            />
                            }
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {note.getString(schema.text)}
                                </Typography>
                            </CardContent>
                            <CardActions >
                                <Button variant="outlined" color="primary" onClick={()=> instance.deleteNote(note)}><DeleteForeverIcon/></Button>
                                <InputLabel><VisibilityIcon/> {note.getString(schema.publicAccess)} </InputLabel>

                            </CardActions>
                        </Card>
                    })}

            </div>
        )
    }
}
