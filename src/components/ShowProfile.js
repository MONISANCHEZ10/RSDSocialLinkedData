import React from 'react'
import auth from 'solid-auth-client'
import datt from "@solid/query-ldflex";
import InputLabel from "@material-ui/core/InputLabel";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Helpers  from "../lib/helpers";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

export default class ShowProfile extends React.Component {

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
            country: ""
        };
        console.log(props)

    }

    componentWillReceiveProps(nextProps) {
        console.log('update props', this.props, nextProps)
        const { webId } = this.props
        if (nextProps.webId !== "" && webId !== nextProps.webId) {
            this.setState({ webId: nextProps.webId })
            console.log(this.state.webId)
            const myWebId = datt[nextProps.webId];
            // Helpers.getProfileData(myWebId).then(() => console.log('done'))
            Helpers.getProfileData( myWebId).then((dataUser) => {
                console.log(dataUser);
                this.setState({...this.state, ...dataUser});
            })
        }
    }

    componentDidMount() {
        console.log("desmontndo componente")
         auth.trackSession(async(session) => {
                if(session){
                     if(session && this.props.webId == {}){
                         console.log("WEB ID DE SHOW amigo")
                         this.setState({webId: this.props.webId});
                     }
                     else{
                        this.setState({webId: session && session.webId});
                     }
                     const myWebId = datt[this.state.webId];
                    Helpers.getProfileData( myWebId).then((dataUser) => {
                        console.log(dataUser);
                        this.setState({...this.state, ...dataUser});
                    })

                    return null;
                 }
             });
    }

    render() {
        const { webId } = this.state;
        return (
            <div>
                <Card  className={{ maxWidth: 845}}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="recipe"  style ={{  height :"10rem" ,width: "10rem" }} src={this.state.image} >  </Avatar>
                        }
                        title={this.state.fn}
                    />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item >
                                <InputLabel className='label'>WEB ID: </InputLabel>
                                <TextField className='input-label' variant="outlined"   style = {{  width: '56ch' }} value={webId} disabled/>
                                <InputLabel className='label'>SOBRE MI:</InputLabel>
                                <TextField className='input-label' variant="outlined"   style = {{  width: '56ch' }} value={this.state.note} disabled/>
                                <InputLabel className='label'>EMAIL:</InputLabel>
                                <TextField className='input-label' variant="outlined"   style = {{  width: '56ch' }} value={this.state.email} disabled/>
                                <InputLabel className='label'>COMPANIA:</InputLabel>
                                <TextField className='input-label' variant="outlined"   style = {{  width: '56ch' }} value={this.state.company} disabled/>
                                <InputLabel className='label'>DIRECCION:</InputLabel>
                                <TextField className='input-label' variant="outlined"   style = {{  width: '56ch' }} value={this.state.address} disabled/>
                            </Grid>
                            <Grid item >
                                <InputLabel className='label'>TELEFONO:</InputLabel>
                                <TextField className='input-label' variant="outlined"   style = {{  width: '56ch' }} value={this.state.phone} disabled/>
                                <InputLabel className='label'>PAIS:</InputLabel>
                                <TextField className='input-label' variant="outlined"   style = {{  width: '56ch' }} value={this.state.country} disabled/>
                                <InputLabel className='label'>CODIGO POSTAL:</InputLabel>
                                <TextField className='input-label' variant="outlined"   style = {{  width: '56ch' }} value={this.state.postalCode} disabled/>
                                <InputLabel className='label'>REGION:</InputLabel>
                                <TextField className='input-label' variant="outlined"   style = {{  width: '56ch' }} value={this.state.region} disabled/>
                                <InputLabel className='label'>LOCALIDAD: </InputLabel>
                                <TextField className='input-label' variant="outlined"   style = {{  width: '56ch' }} value={this.state.locality} disabled/>


                            </Grid>
                        </Grid>
                    </CardContent>

                </Card>
            </div>
        )
    }


}
