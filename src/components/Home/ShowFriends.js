import React from 'react'
import auth from 'solid-auth-client'
import data from "@solid/query-ldflex";
import Button from "@material-ui/core/Button";
import {Grid} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import ShowProfile from "../ShowProfile";
import Modal from 'react-awesome-modal';
import Avatar from "@material-ui/core/Avatar";
import Helpers  from "../../lib/helpers"
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Row from "react-bootstrap/cjs/Row";
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import TextField from "@material-ui/core/TextField";
import CancelSharpIcon from '@material-ui/icons/CancelSharp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

export default class ShowFriends extends React.Component {

    constructor(props) {
        super(props);
        this.state = {  webId: null, friends: [], user: null,   visible : false, modalWebId: ""};
        this.webIdNewFriend = this.webIdNewFriend.bind(this);
        this.AddFriendSubmit = this.AddFriendSubmit.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }

    async componentWillMount() {
        await  auth.trackSession(session => {
            if(session){
                this.setState({ webId: session.webId });
                this.state.user = data[session.webId];
                Helpers.getFriends(this.state.user).then(friends =>this.setState({friends}));

            }
        });
    }


    webIdNewFriend(event) {
        this.setState({value: event.target.value});
    }

    async AddFriendSubmit(event) {
        event.preventDefault();
        await Helpers.addOrRemoveFriend(this.state.value, "insertions")
    }

    async removeFriend ( webId) {
        await Helpers.addOrRemoveFriend(webId, "deletions")
    }

    openModal( modalWebId) {
        console.log("modal web amigo")
        console.log(modalWebId)
        this.state.modalWebId = modalWebId;
        this.setState({
            modalWebId : modalWebId,
        });
        this.setState({
            visible : true,
        });
        console.log(this.state)

    }

    closeModal() {
        this.setState({
            visible : false,
            modalWebId : "",
        });

    }
    render() {
        const responsive = {
            superLargeDesktop: {
                // the naming can be any, depends on you.
                breakpoint: { max: 4000, min: 3000 },
                items: 5
            },
            desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 3
            },
            tablet: {
                breakpoint: { max: 1024, min: 464 },
                items: 2
            },

        };
        const {  friends} = this.state;
        const instance = this;
        const modal = (
            <div style={{ maxHeight: 245}}>
                <Modal visible={this.state.visible} width="900"
                       style={{overflow: 'scroll'}}
                       aria-labelledby="simple-modal-title"
                       aria-describedby="simple-modal-description"
                       onClickAway={() => this.closeModal()}>
                    <div className='right'>
                        <Button    variant="contained" color="primary" size="large" onClick={this.closeModal}>  <CancelSharpIcon variant="Outlined" /></Button>

                    </div>
                    <div>
                        <ShowProfile webId={this.state.modalWebId} />
                    </div>
                </Modal>
            </div>
        )

        return (
            <div className=" container post-topbar" >

                <div >
                    <div className=" search-box">
                        <form onSubmit={this.AddFriendSubmit} >
                            <input type="text" placeholder="WebId" value={this.state.value} onChange={this.webIdNewFriend}/>
                            <button type="submit">AGREGAR</button>
                        </form>
                    </div>
                </div>


                <Grid container>
                </Grid>


                <br/><br/>
                <div className="companies-list">
                    <div className="row">
                        {friends.map(function(friend, index){
                            return <div key={ index } className={"col-lg-4 col-md-4 col-sm-6 col-12"}>
                                <div className="company_profile_info">
                                    <Avatar  style ={{  height :"7rem" ,width: "7rem" }} src={friend.img} >  </Avatar>
                                    {friend.name}
                                    <div className="row">
                                        <div className="col">
                                            <Button  color="primary" size="small" href={friend.webId} target="_blank"><AccountBoxIcon/> POD</Button>
                                        </div>
                                        <div className="col"> <Button  color="secondary" size="small"  onClick={()=> instance.removeFriend(friend.webId.toString())}><DeleteForeverIcon/></Button>
                                        </div>
                                    </div>



                                    <div className="user-profy">
                                        <a href="#" title="">
                                            <Button color="primary" size="small"  onClick={() =>instance.openModal(friend.webId.toString())}> <VerticalSplitIcon/>VER PERFIL</Button>
                                        </a>
                                    </div>
                                </div>
                            </div>

                        })}


                    </div>
                </div>



                <div>
                    {modal }
                </div>



            </div>

        )
    }


}
