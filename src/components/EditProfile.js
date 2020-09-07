import React from 'react'
import auth from 'solid-auth-client'
import datt from "@solid/query-ldflex";
import {namedNode} from "rdflib";
import {Button, Backdrop, CircularProgress } from "@material-ui/core";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import InputLabel from "@material-ui/core/InputLabel";
const $rdf = require('rdflib')
import {solid, space} from "rdf-namespaces";
import {fetchDocument} from "tripledoc";
const FC   = require('solid-file-client')
const fc   = new FC( auth )
import ImageUploading from "react-images-uploading";
import Helpers from "../lib/helpers";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { styled } from '@material-ui/core/styles';
import WallpaperIcon from '@material-ui/icons/Wallpaper';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {readonlyValue} from "rdf-namespaces/dist/schema";
const MyBackdrop = styled(Backdrop)({
    zIndex: 'theme.zIndex.drawer + 1',
    color: '#fff',
});

export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            webId: null,
            fn: "",
            title: "",
            role: "",
            company: "",
            email: "",
            phone: "",
            note: "",
            address: "",
            locality: "",
            postalCode: "",
            region: "",
            country: "",
            photos: [],
            showSpinner: false,
        };
        this.webIdNewFriend = this.webIdNewFriend.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.inputRole = this.inputRole.bind(this);
        this.inputCompany = this.inputCompany.bind(this);
        this.inputEmail = this.inputEmail.bind(this);
        this.textPost = this.textPost.bind(this);
        this.inputRegion = this.inputRegion.bind(this)
        this.inputPhone = this.inputPhone.bind(this);
        this.inputAddress = this.inputAddress.bind(this);
        this.inputCountry = this.inputCountry.bind(this);
        this.inputLocality = this.inputLocality.bind(this);
        this.inputPostalCode = this.inputPostalCode.bind(this);
        this.onChange = this.onChange.bind(this);
        this.inputNote = this.inputNote.bind(this);
        this.rdf = $rdf;
        this.updateManager = new $rdf.UpdateManager(this.store);
    }

   async componentWillMount() {
      await  auth.trackSession(session => {
            if(session){
                this.setState({ webId: session && session.webId });
                const myWebId = datt[this.state.webId];
              //  this.getProfileData(myWebId);
                Helpers.getProfileData( myWebId).then((dataUser) => {
                    console.log(dataUser);
                    this.setState({...this.state, ...dataUser});
                })
            }
        });
    }


    async handleSave(e) {
        e.preventDefault();

        this.setState({showSpinner: true});
        // this.handleToggle();

        Helpers.updateProfileData( this.state).then((dataUser) => {
            console.log(dataUser);
            this.setState({showSpinner: false});
            this.setState({...this.state, ...dataUser});
        })
    };

    webIdNewFriend(event) {
        this.setState({fn: event.target.value});
    }
    inputRole(event) {
        this.setState({role: event.target.value});
    }
    inputCompany(event){
        this.setState({company: event.target.value});
    }
    inputEmail(event){
        this.setState({email: event.target.value});
    }

    inputPhone(event){
        this.setState({phone: event.target.value});
    }

    inputAddress(event){
        this.setState({address: event.target.value});
    }

    inputCountry(event){
        this.setState({country: event.target.value});
    }
    inputPostalCode(event){
        this.setState({postalCode: event.target.value});
    }
    inputLocality(event){
        this.setState({locality: event.target.value});
    }
    inputRegion(event){
        this.setState({region: event.target.value});
    }
    inputNote(event){
        this.setState({note: event.target.value});
    }
    textPost(event) {
        this.setState({value: event.target.value});
    }

   async onChange  (imageList) {
        const webIdDoc = await fetchDocument(this.state.webId);
        const profile = webIdDoc.getSubject(this.state.webId);
        const storage = profile.getRef(space.storage);
        const notesListRef = storage + "profile/";
        const sendTo =notesListRef + imageList[0].file.name
       await fc.copyFile(imageList[0].dataURL, sendTo  )
       try {
           const { user } = datt;
           await user.vcard_hasPhoto.set(namedNode(sendTo));
           this.setState({photos: [sendTo]});
           this.setState({image: sendTo});
           alert("subida");
       } catch (error) {
           alert("error")
       }

   };
    onError  (errors, files)  {
        console.log(errors, files);
    };

    handleClose () {
        this.setState({showSpinner : false})
    };

    render() {

        return (
            <div>

                <form onSubmit={this.handleSave}>

                    <div className={{  flexGrow: 1}}>
                        <Grid container spacing={3} className='label'>

                            <Grid item xs={12} sm={6}>
                                <Avatar aria-label="recipe"  style ={{  height :"10rem" ,width: "10rem" }} src={this.state.image} >  </Avatar>
                                <ImageUploading
                                    onChange={this.onChange}
                                    maxNumber={10}
                                    multiple
                                    maxFileSize={5 * 1024 * 1024}
                                    acceptType={["jpg", "gif", "png"]}
                                    onError={this.onError}
                                >
                                    {({  onImageUpload }) => (

                                        <div>
                                            <Button onClick={onImageUpload} variant="contained" size="small" color="primary" > <WallpaperIcon/> &nbsp; ACTUALIZAR</Button>
                                        </div>
                                    )}
                                </ImageUploading>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InputLabel className='label'>NOMBRE DE USUARIO</InputLabel>
                                <TextField className='input-label' type="text" variant="outlined"   style = {{  width: '56ch' }} value={this.state.fn} onChange={this.webIdNewFriend} />
                                <br/><br/>
                                <InputLabel className='label' >SOBRE MI</InputLabel>
                                <TextareaAutosize className='input-label' variant="outlined"  aria-label="height" style = {{  width: '56ch' }} rowsMin={3} placeholder="Minimum 3 rows" value={this.state.note} onChange={this.inputNote}/>
                            </Grid>
                        </Grid>
                    </div>

                    <br/><br/>
                    <div className={{  flexGrow: 7}}>
                        <Grid container spacing={2}>
                            <Grid item >
                                <InputLabel className='label'>EMAIL:</InputLabel>
                                <TextField type="email" disabled={readonlyValue} className='input-label' variant="outlined" style = {{  width: '56ch' }}     value={this.state.email} onChange={this.inputEmail} />
                                <br/><br/>
                                <InputLabel className='label'>DIRECCION:</InputLabel>
                                <TextField type="text"  className='input-label' variant="outlined" style = {{  width: '56ch' }}   value={this.state.address} onChange={this.inputAddress} />
                                <br/><br/>
                                <InputLabel className='label'>COMPANIA:</InputLabel>
                                <TextField type="text"  className='input-label' variant="outlined"  style = {{  width: '56ch' }}  value={this.state.company} onChange={this.inputCompany} />

                            </Grid>
                            <Grid item >
                                <InputLabel className='label'>ROLE: </InputLabel>
                                <TextField type="text"  className='input-label' variant="outlined"  style = {{  width: '46ch' }}  value={this.state.role} onChange={this.inputRole} />
                                <br/><br/>
                                <InputLabel className='label'>LOCALIDAD:</InputLabel>
                                <TextField type="text"   className='input-label' variant="outlined"  style = {{  width: '46ch' }}  value={this.state.locality} onChange={this.inputLocality} />
                                <br/><br/>
                                <InputLabel className='label'>REGION:</InputLabel>
                                <TextField type="text"  className='input-label' variant="outlined"  style = {{  width: '46ch' }}  size="large"  defaultValue="Normal" value={this.state.region} onChange={this.inputRegion} />

                            </Grid>
                            <Grid item>
                                <InputLabel className='label'>TELEFONO:</InputLabel>
                                <TextField type="tel"  className='input-label' variant="outlined"   pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"  placeholder="123-45-678"
                                           value={this.state.phone} onChange={this.inputPhone} />
                                <br/><br/>
                                <InputLabel className='label'>CODIGO POSTAL:</InputLabel>
                                <TextField type="text"   className='input-label' variant="outlined"  value={this.state.postalCode} onChange={this.inputPostalCode} />
                                <br/><br/>
                                <InputLabel className='label'>PAIS:</InputLabel>
                                <TextField type="text"   className='input-label' variant="outlined"  value={this.state.country} onChange={this.inputCountry} />

                            </Grid>
                        </Grid>
                    </div>
                    <br/><br/>
                    <Grid>
                        <Button  type="submit"  variant="contained" color="primary" size="small"  > <CloudUploadIcon/> &nbsp; GUARDAR</Button>
                    </Grid>

                    <MyBackdrop open={this.state.showSpinner} onClick={this.handleClose.bind(this)}>
                        <CircularProgress color="inherit" />
                    </MyBackdrop>

                </form>

            </div>
        )
    }
}
