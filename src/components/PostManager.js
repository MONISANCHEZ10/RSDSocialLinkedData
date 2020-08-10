import React from 'react'
import  { fetchDocument, createDocument } from 'tripledoc';
import auth from 'solid-auth-client'
import { ldp, foaf, rdf, schema, vcard, solid, space } from "rdf-namespaces";
import {Grid} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
const $rdf = require('rdflib')

export default class PostManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {  webId: null, notes: [], notesList: null, notesListRef: null };
        this.textPost = this.textPost.bind(this);
        this.AddPostSubmit = this.AddPostSubmit.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
        this.rdf = $rdf;
        this.updateManager = new $rdf.UpdateManager(this.store);
    }

    async componentWillMount() {
        await  auth.trackSession(session => {
            if(session){
                this.setState({ webId: session.webId });
                console.log("WEB ID :" + this.state.webId);
                this.getPosts(session.webId).then(notes =>this.setState({notes}));
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
        await this.addNote(this.state.value , await fetchDocument(this.state.notesListRef));
        return this.getPosts(this.state.webId).then(notes =>this.setState({notes}));

    }

    async  deleteNote(note) {
         const noteList = await fetchDocument(this.state.notesListRef)
        if (noteList) {
            noteList.removeSubject(note.asRef());
            const updatedDoc = await noteList.save();
            console.log(updatedDoc)
            return this.getPosts(this.state.webId).then(notes =>this.setState({notes}));
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
    render() {
        const {  notes} = this.state;
        const instance = this;
        return (
            <div>
                <div>
                    <form onSubmit={this.AddPostSubmit}>

                        <Grid container spacing={3}>
                            <Grid item xs={2}>
                                <InputLabel>ESCRIBIR UNO NUEVO </InputLabel>
                            </Grid>
                            <Grid item xs={6}>

                                <textarea cols="50" rows="5" value={this.state.value} onChange={this.textPost} />
                            </Grid>
                            <Button  variant="outlined" color="primary"  type="submit"> NUEVO POST</Button>
                        </Grid>
                    </form>
                </div>
                <br/><br/>

                <ul>
                    {notes.map(function(note, index){
                        return <Card key={ index }>
                            <Grid container spacing={3}>
                                <Grid item xs={2}>
                                    <label>{ note.getString(schema.dateCreated)}</label>
                                </Grid>
                                <Grid item xs={6}>
                                    <textarea cols="50" rows="5" >{note.getString(schema.text)}</textarea>
                                </Grid>
                                <div>
                                    <Button variant="outlined" color="primary" onClick={()=> instance.deleteNote(note)}>ELiminar</Button>
                                </div>
                            </Grid>
                        </Card>
                    })}
                </ul>

            </div>
        )
    }
}
