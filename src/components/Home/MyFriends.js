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
import {returns} from "rdf-namespaces/dist/hydra";
import PostsHelpers from "../../lib/PostsHelpers";
import {item} from "rdf-namespaces/dist/schema";
import {schema} from "rdf-namespaces";
import CardMedia from "@material-ui/core/CardMedia";

export default class MyFriends extends React.Component {

    constructor(props) {
        super(props);
        this.state = { friends:[], posts: []};
        console.log(props)
    }


   async componentDidMount() {
        console.log("desmontndo componente")
       await auth.trackSession(async(session) => {
            if(session){
                if(session && this.props.webId == {}){
                    console.log("WEB ID DE SHOW amigo")
                    this.setState({webId: this.props.webId});
                }
                else{
                    this.setState({webId: session && session.webId});
                }
                const myWebId = datt[this.state.webId];
               Helpers.getFriends(myWebId).then((dataUser) => {
                    dataUser.forEach(friend=>{
                        friend.post=[];
                      //  let postFriends =
                          PostsHelpers.getPosts2(friend.webId).then(friendPost =>{
                            friend.post = friendPost;

                           let postsState = this.state.posts;
                            friendPost.forEach(post=> {
                                post["webIdFriend"] = friend.webId;
                                post["name"] = friend.name;
                                post["img"] = friend.img;
                                postsState.push(post)
                            })


                            this.setState({posts: postsState})
                        });

                    })

                    this.setState({ friends: dataUser});
                    console.log("C00000000MPLETO POR CADA AMIGO", this.state)
                })

                return null;
            }
        });
    }



    render() {
        const { friends, posts } = this.state;
        const postFriends = [];
        const instance = this;

        function compare( a, b ) {
            if ( a.getInteger(schema.arrivalTime) < b.getInteger(schema.arrivalTime) )
            {     return 1;   }
            if ( a.getInteger(schema.arrivalTime) > b.getInteger(schema.arrivalTime) )
            {     return -1;   }
            return 0; }


        console.log("postsssss")





        return (
            <div style={{ width: "35rem"}}>


                        <div>
                            <div>

                                {posts.sort(compare).map(function(note, index){

                                        note.value  = note.getString(schema.publicAccess);
                                        return <Card key={ index } style={{ maxWidth: "100"}} >
                                            <CardHeader
                                                avatar={
                                                    <Avatar aria-label="recipe"  style ={{  height :"3rem" ,width: "3rem" }} src={note.img} >  </Avatar>
                                                }
                                                title={ note.name}
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
                                        </Card>

                                })}
                            </div>
                            <div>
                            </div>
                        </div>



            </div>
        )
    }


}
