import React from 'react'
import  { fetchDocument, createDocument } from 'tripledoc';
import auth from 'solid-auth-client'
import { ldp, foaf, rdf, schema, vcard, solid, space } from "rdf-namespaces";
import {Grid, Button} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import ImageUploading from "react-images-uploading";
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
const $rdf = require('rdflib')
const FC   = require('solid-file-client')
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
const fc   = new FC( auth )
import CreateIcon from '@material-ui/icons/Create';
import * as session from "solid-auth-cli";
import data from "@solid/query-ldflex";
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import PostsHelpers from "../lib/PostsHelpers";
import PublicIcon from '@material-ui/icons/Public';
import TurnedInIcon from '@material-ui/icons/TurnedIn';
import WallpaperIcon from '@material-ui/icons/Wallpaper';
export default class PostCreator extends React.Component {

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
            <div className="row">
                <div className="col-4">
                    <div className="post-topbar">
                        <div >
                            <Card className="post-bar"  >
                                <CardHeader
                                    avatar={
                                        <Avatar aria-label="recipe"  ><CreateIcon/> </Avatar>
                                    }
                                    title="ESCRIBIR NUEVA PUBLICACION"
                                />
                                <form onSubmit={this.AddPostSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <textarea cols="35" rows="5" value={this.state.value} onChange={this.textPost} />
                                        </Grid>
                                    </Grid>
                                    <div className="row">
                                        <div className="col">         <ImageUploading
                                            onChange={this.onChange}
                                            maxNumber={10}
                                            maxFileSize={5 * 1024 * 1024}
                                            acceptType={["jpg", "gif", "png"]}
                                            onError={this.onError}
                                        >
                                            {({ imageList, onImageUpload, onImageRemoveAll }) => (
                                                // write your building UI
                                                <div>
                                                    <Button variant="contained" color="primary" onClick={onImageUpload}><AddPhotoAlternateIcon/> </Button>

                                                    {imageList.map((image) => (
                                                        <div key={image.key}>
                                                            <img width = "50px"  src={image.dataURL} />

                                                            <Button variant="contained" color="primary" onClick={image.onUpdate}>Update</Button>
                                                            <Button  variant="contained" color="secondary"  onClick={image.onRemove}>Remove</Button>

                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </ImageUploading></div>
                                        <div className="col">  <Button  variant="contained"  color="primary"  type="submit"> GUARDAR</Button></div>
                                    </div>


                                </form>
                            </Card>
                        </div>
                    </div>

                </div>
                <div className="col-8">


                <div className="post-topbar">

                                {notes.map(function(note, index){
                                    note.value  = note.getString(schema.publicAccess);
                                    return <Card key={ index }  >
                                        <CardHeader
                                            avatar={
                                                <Avatar aria-label="recipe"  ><TurnedInIcon/> </Avatar>
                                            }
                                            title={note.getString(schema.additionalName)}
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
                                            <Button  color="secondary" size="large" onClick={()=> instance.deleteNote(note)}><DeleteForeverIcon/></Button>

                                            <FormControl component="fieldset">
                                                <FormLabel component="legend">Visible para</FormLabel>
                                                <RadioGroup aria-label="gender" name="gender1" value={  note.value } onChange={instance.handleChange}>
                                                    <div className="row">
                                                        <div className="col"><FormControlLabel value="public"  name={note.getString(schema.additionalName)} control={<Radio />}  label="Público" ><PublicIcon/></FormControlLabel>
                                                        </div>
                                                        <div className="col">  <FormControlLabel value="onlyme" name={note.getString(schema.additionalName)} control={<Radio />} label="Privado" />
                                                        </div>
                                                        <div className="col"> <FormControlLabel value="friends" name={note.getString(schema.additionalName)}  control={<Radio />} label="Amigos" />
                                                        </div>
                                                    </div>
                                                    </RadioGroup>
                                            </FormControl>


                                        </CardActions>
                                    </Card>

                                })}

                </div>
                </div>


            </div>
        )
    }
}
