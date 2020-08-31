import React from 'react'
import  { fetchDocument, createDocument } from 'tripledoc';
import auth from 'solid-auth-client'
import { ldp, foaf, rdf, schema, vcard, solid, space } from "rdf-namespaces";
import {Grid, Button, CircularProgress, Backdrop, Container} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import ImageUploading from "react-images-uploading";
import {styled} from "@material-ui/core/styles";
const $rdf = require('rdflib')
const FC   = require('solid-file-client')
const fc   = new FC( auth )
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import UpdateIcon from '@material-ui/icons/Update';



const MyBackdrop = styled(Backdrop)({
    zIndex: 'theme.zIndex.drawer + 1',
    color: '#fff',
});

export default class PostManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            webId: null,
            notes: [],
            notesList: null,
            notesListRef: null,
            image: null,
            fileImage: null ,
            photo: "",
            showSpinner: false,
        };
        this.textPost = this.textPost.bind(this);
        this.AddPostSubmit = this.AddPostSubmit.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
        this.onChange = this.onChange.bind(this);
        this.rdf = $rdf;
        this.updateManager = new $rdf.UpdateManager(this.store);
    }


    async  componentWillReceiveProps(nextProps) {
        console.log("WILL MOUNT...")
        const { webId } = this.props
        if (nextProps.webId !== "" && webId !== nextProps.webId) {
            this.setState({ webId: session.webId });
            console.log("WEB ID :" + this.state.webId);
            this.getPosts(this.state.webId).then(notes =>this.setState({notes}));
        }



    }
    async  componentDidMount(nextProps) {
        console.log("DID MOUNT...")
        await  auth.trackSession(session => {
            if(session){
                this.setState({ webId: session.webId });
                console.log("WEB ID :" + this.state.webId);
                this.getPosts(this.state.webId).then(notes =>this.setState({notes}));
            }
        });
    }
    async  getPosts(webId) {
        const webIdDoc = await fetchDocument(webId);
        const profile = webIdDoc.getSubject(webId);
        /* 1. Check if a Document tracking our notes already exists. */
        const publicTypeIndexRef = profile.getRef(solid.publicTypeIndex);
        const publicTypeIndex = await fetchDocument(publicTypeIndexRef);
        const notesListEntry = publicTypeIndex.findSubject(solid.forClass, schema.TextDigitalDocument  );
        /* 2. If it doesn't exist, create it. */
        try {
            /* 3. If it does exist, fetch that Document. */
            this.state.notesListRef = notesListEntry.getRef(solid.instance);
            const listNotes =(await fetchDocument(this.state.notesListRef));
            return listNotes.getAllSubjectsOfType(schema.TextDigitalDocument);
        }
        catch ( e ){
            console.log("Document null, creating new document...");
            return this.initialiseNotesList(profile, publicTypeIndex);
        }
    }

    async  initialiseNotesList(profile, typeIndex) {
        // Get the root URL of the user's Pod:
        const storage = profile.getRef(space.storage);
        // Decide at what URL within the user's Pod the new Document should be stored:
        const notesListRef = storage + "public/social.ttl";
        // Create the new Document:
        const notesList = createDocument(notesListRef);
        await notesList.save();
        // Store a reference to that Document in the public Type Index for `schema:TextDigitalDocument`:
        const typeRegistration = typeIndex.addSubject();
        typeRegistration.addRef(rdf.type, solid.TypeRegistration);
        typeRegistration.addRef(solid.instance, notesList.asRef());
        typeRegistration.addRef(solid.forClass, schema.TextDigitalDocument);
        await typeIndex.save([typeRegistration]);
        // And finally, return our newly created (currently empty) notes Document:
        return notesList;
    }

    textPost(event) {
        this.setState({value: event.target.value});
    }

    async AddPostSubmit(event) {
        event.preventDefault();
        console.log(this.state.notes)
        console.log(event.target)
        this.setState({showSpinner: true});
        await this.addNote(this.state.value , await fetchDocument(this.state.notesListRef));

        this.getPosts(this.state.webId).then(notes => {
            this.setState({showSpinner: false});
            this.setState({notes})
        });
        console.log(this.state.notes)
    }

    async  deleteNote(note) {
        const noteList = await fetchDocument(this.state.notesListRef)
        if (noteList) {
            this.setState({showSpinner: false});
            noteList.removeSubject(note.asRef());
            const updatedDoc = await noteList.save();
            console.log(updatedDoc)
            return this.getPosts(this.state.webId).then(notes =>{
                this.setState({showSpinner: false});
                this.setState({notes})
            });
        }
    }

    async  addNote(note, notesList) {
        // Initialise the new Subject:
        const newNote = notesList.addSubject();
        // Indicate that the Subject is a schema:TextDigitalDocument:
        newNote.addRef(rdf.type, schema.TextDigitalDocument);
        // Set the Subject's `schema:text` to the actual note contents:
        newNote.addString(schema.dateCreated, new Date(Date.now()).toString().substring(0, 21));
        newNote.addString(schema.text, note);

        // Store the date the note was created (i.e. now):

        if(this.state.fileImge !== null){
            const webIdDoc = await fetchDocument(this.state.webId);
            const profile = webIdDoc.getSubject(this.state.webId);
            const storage = profile.getRef(space.storage);
            const notesListRef = storage + "public/social/";
            const sendTo =notesListRef + this.state.fileImge.file.name
            console.log(sendTo)
            console.log(this.state.fileImge.dataURL)
            await fc.copyFile(this.state.fileImge.dataURL, sendTo  )
            console.log(this.state.fileImge.dataURL)
           // alert("realizado imagen cargada a public");
            this.state.image = sendTo;
            console.log("SUBIDA EN :"+ this.state.image)
            newNote.addRef(schema.image, this.state.image);

        }

        const success = await notesList.save([newNote]);

        return success;
    }

    async UpdateNote(){
        const noteList = await fetchDocument(this.state.notesListRef)
        if (noteList) {
            noteList.removeSubject(note.asRef());
            const updatedDoc = await noteList.save();
            console.log(updatedDoc)
        }
    }

    async onChange  (imageList) {
        console.log("IMAGE ....")
        this.state.fileImge = imageList[0] === undefined? null : imageList[0]
    };

    onError  (errors, files) {
        console.log(errors, files);
    };

    handleClose () {
        this.setState({showSpinner : false})
    };

    render() {
        const {  notes} = this.state;
        const instance = this;

        return (
            <div>
                GALERIA
            <Container component="main"  >
                    <ImageUploading
                        onChange={this.onChange}
                        maxNumber={1}
                        maxFileSize={5 * 1024 * 1024}
                        acceptType={["jpg", "gif", "png"]}
                        onError={this.onError}
                    >
                        {({ imageList, onImageUpload, onImageRemoveAll }) => (
                            // write your building UI
                            <div>
                                <Button variant="contained" color="primary" onClick={onImageUpload}>Nueva Foto</Button>

                                {imageList.map((image) => (
                                    <div key={image.key}>
                                        <img width = "200rem"  src={image.dataURL} />
                                        <Button variant="contained" color="primary" onClick={image.onUpdate}><UpdateIcon/></Button>
                                        <Button variant="contained" color="secondary" onClick={image.onRemove}><DeleteForeverIcon /></Button>
                                        <form onSubmit={this.AddPostSubmit} style={{ maxWidth: 245}}>
                                                    <InputLabel>Pie de Foto: </InputLabel>
                                                    <textarea cols="25" rows="2"  value={this.state.value} onChange={this.textPost} />
                                                    <Button  variant="contained" color="primary" size="large" type="submit"> GUARDAR</Button>
                                        </form>

                                    </div>
                                ))}


                            </div>
                        )}
                    </ImageUploading>

                <br/>

                <ul>

                    {notes.reverse().map(function(note, index){
                        return <Card key={ index } style={{ maxWidth: 245}} >
                            <CardHeader
                             //   title=  {note.getString(schema.text)}
                                subheader={ note.getString(schema.dateCreated)}
                            />
                            {note.getRef(schema.image) !== null &&
                            <CardMedia
                                style={{height: 0, paddingTop: '56.25%'}}
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
                                <Button variant="outlined" color="secondary" onClick={()=> instance.deleteNote(note)}><DeleteForeverIcon/></Button>
                            </CardActions>
                        </Card>

                    })}
                </ul>


                <MyBackdrop open={this.state.showSpinner} onClick={this.handleClose.bind(this)}>
                    <CircularProgress color="inherit" />
                </MyBackdrop>

            </Container>
            </div>
        )
    }
}