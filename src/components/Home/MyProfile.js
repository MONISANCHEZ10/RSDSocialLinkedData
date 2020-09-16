import React from 'react'
import auth from 'solid-auth-client'
import datt from "@solid/query-ldflex";
import InputLabel from "@material-ui/core/InputLabel";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Helpers from "../../lib/helpers";
import Button from "@material-ui/core/Button";
import AccountBoxIcon from '@material-ui/icons/AccountBox';

export default class MyProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        console.log(props)

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

                <div className="user-data full-width">
                    <div className="user-profile">
                        <div className="username-dt">
                            <div className="usr-pic">
                                <img  src={this.state.image} alt="Photo profile"/>
                            </div>
                        </div>
                        <div className="user-specs">
                            <h5>{ this.state.fn}</h5>
                            <h6> {this.state.country}</h6>
                        </div>
                    </div>
                    <ul className="user-fw-status">
                        <li>
                            <p>{ this.state.note}</p>
                            <Button variant="outlined" color="primary" href={webId} target="_blank"><AccountBoxIcon/> MI POD</Button>
                        </li>
                    </ul>
                </div>




                <Card  style={{ maxWidth: 245}}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="recipe"  style ={{  height :"7rem" ,width: "7rem" }} src={this.state.image} >  </Avatar>
                        }
                        title="Sobre Mi"
                        subheader={ this.state.note}
                    />
                    <CardContent>
                        <Typography variant="caption" display="block" gutterBottom>
                            {this.state.fn}<br/>
                            {this.state.country}<br/>
                          </Typography>
                    </CardContent>
                </Card>
            </div>
        )
    }
}
