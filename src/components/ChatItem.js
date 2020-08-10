import React from "react";
import {AgentSolid} from "../lib/agent-solid";
import data from "@solid/query-ldflex";
// import chat from '../assets/css/chat.css'

export default class ChatItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };

        this.something = "Doc Element"
        this.url = props.url;
        this.webId = props.webId;
        this.other = []
        this.lang=navigator.language
        this.maker = ""
        this.date = ""
        this.content = ""
        this.types = []
        this.makername = ""
        this.makerimg = ""
        this.comments = []
        this.parentItem = ""
       // this.discover = {}
        this.discover = props.discover;
        console.log(props)
        this.chatOwner = props.chatOwner;

        this.firstUpdated();
    }

    firstUpdated(){
        var app = this;

        this.agent = new AgentSolid(this.name);
        this.agent.receive = function(from, message) {
            if (message.hasOwnProperty("action")){
                switch(message.action) {
                    case "webIdChanged":
                        app.webIdChanged(message.webId)
                        break;
                    default:
                        console.log("Unknown action ",message)
                }
            }
        };
        this.updateDocument()
    }


    openmenu(e){
        var cibleName = e.target.getAttribute("menu")
        var menu = this.shadowRoot.getElementById(cibleName)
        menu.classList.contains("d-none") ? menu.classList.remove("d-none") : menu.classList.add("d-none")
    }

    reply(e){
        console.log(this.url, this.agent, this.maker)
        //this.agent.send("Input", {action: "reply", replyTo: {url: this.url, maker: this.maker}})
        this.agent.send("Dialog", {action : "toggle", params: {action:"reply", replyTo: {url: this.url, maker: this.maker, discover: this.discover}}})
    }


    async updateDocument(){
        var app = this
        var doc=[]
        try {
            var webid = await data.user
            console.log(`${webid}`)
            this.webId=`${webid}`
        }catch(e){
            this.webId = null
        }


        console.log(this.url.split('#')[1].startsWith('Msg'))
        //filtre les messages
        if (this.url.split('#')[1].startsWith('Msg')){
            for await (const property of data[this.url].properties)
            {
                //  console.log("Prop",`${property}`)
                switch(`${property}`) {
                    case "http://xmlns.com/foaf/0.1/maker":
                        var maker = await data[this.url][`${property}`]
                        var makername = await data[`${maker}`].vcard$fn
                        var makerimg = await data[`${maker}`].vcard$hasPhoto || "";
                        app.maker = `${maker}`
                        app.makername = `${makername}`
                        app.makerimg = `${makerimg}`
                        break;
                    case "http://purl.org/dc/terms/created":
                        var date = await data[this.url][`${property}`]
                        app.date = `${date}`
                        break;
                    case "http://rdfs.org/sioc/ns#content":
                        var content = await data[this.url][`${property}`]
                        app.content = `${content}`
                        break;
                    case "http://www.w3.org/2000/01/rdf-schema#type":
                        for await (const type of data[this.url][`${property}`])
                        {
                            //  console.log("Type",`${type}`)
                            app.types = [... app.types, `${type}`]
                        }
                        break;
                    case "http://schema.org/parentItem":
                    case "http://schema.org/target":
                        var parentItem = await data[this.url][`${property}`]
                        app.parentItem = `${parentItem}`
                        break;
                    case "http://schema.org/comment":
                        for await (const comment of data[this.url][`${property}`])
                        {
                            //  console.log("Comment",`${comment}`)
                            app.comments = [... app.comments, `${comment}`]
                        }
                        break;

                    default:
                        //  console.log("default", this.url)
                        var values = []
                        for await (const val of data[this.url][`${property}`])
                        {
                            /*if(`${val}` == "http:/schema.org/AgreeAction" && `${val}` == "http:/schema.org/DisagreeAction"){
                            d.likeAction = true
                          }*/
                            values.push(`${val}`)
                            console.log(`${values}`)
                        }

                        this.other = [... this.other, {property: `${property}` , values: values}]
                }

            }
        }
        else{
            console.log("je ne traite pas encore les messages document de type",this.url)
        }

    }

    localDate(d){
        //  console.log(d)
        d = new Date(d).toLocaleTimeString(this.lang)
        //  console.log(d)
        return d
    }
    localName(str){
        if(str != undefined){
            var ln = str.substring(str.lastIndexOf('#')+1);
            ln == str ? ln = str.substring(str.lastIndexOf('/')+1) : "";
            //  ln == "me" ? ln =  : "";
        }else{
            ln = "--"
        }
        return ln
    }

    render() {

        return (
            <div>

                {this.maker == this.webId &&
                <div className="d-flex justify-content-end mb-4">
                    <div className="msg_cotainer_send">
                        <div className="row d-none d-lg-block">

                            {this.types.length > 0 ?
                                (
                                    this.types.map((t, index) => {
                                            return <button type="button"
                                                           class="btn btn-outline-dark btn-sm">{this.localName(t)}</button>
                                        }
                                    )
                                )
                                : ('')

                            }

                            {this.content}


                            <div className="row">
                                <div className="col">
                                    {this.comments.length > 0 ?
                                        (
                                            // this.comments.length + 'com'
                                            this.comments.map((c, index) => {
                                                    return <a href={c} target="_blank">{index}</a>
                                                }
                                            )
                                        ) : ('')
                                    }

                                </div>

                                <div className="col">
                                    {this.parentItem != "" && this.parentItem != "undefined" &&
                                    <a href={this.parentItem} target="_blank">Parent</a>
                                    }
                                </div>


                                <div>
                                    <button class="btn btn-primary btn-sm" onClick={this.reply.bind(this)}>
                                        <i class="fas fa-reply "></i></button>
                                    <a class="btn btn-primary btn-sm" href={this.url} target="_blank">
                                        <i class="fas fa-link"></i></a>
                                    <a class="btn btn-primary btn-sm"
                                       href={"https://scenaristeur.github.io/spoggy-simple/?source=" + this.url}
                                       target="_blank">
                                        <i class="fas fa-project-diagram"></i>
                                    </a>
                                </div>


                            </div>


                            {this.webId != null &&
                                <button class="btn btn-primary btn-sm" onClick={this.reply}>
                                    <i class="fas fa-reply" ></i>
                                </button>
                            }

                        </div>
                    </div>
                    {/* end msg_cotainer_send */}


                    <div className="img_cont_msg d-none d-lg-block">
                        {this.makerimg.length > 0 ?
                            (
                                <img className="rounded-circle user_img_msg"
                                     src={"//images.weserv.nl/?url=" + this.makerimg + "&w=32&h=32"}
                                     title={this.makerimg}
                                     alt="no image"/>
                            ) :
                            (
                                <i className="fas fa-user-circle fa-2x" title={this.makername}></i>
                            )
                        }
                    </div>

                    <div className="msg_cotainer">

                        <div className="row d-none d-lg-block">

                            {this.types.length > 0 &&
                                this.types.map((t, index) => {
                                   return <button type="button" key={index} className="btn btn-outline-dark btn-sm">{this.localName(t)}</button>
                                })
                            }

                        </div>

                        <small><b>{this.makername} : </b></small>

                        {this.content}

                        <div className="row">
                            <div className="col">

                                {this.comments.length > 0 &&
                                    <div className="row font-weight-light">
                                        {this.comments.map((c, index) => {
                                            return <a href={c} target="_blank">{index}</a>
                                        })
                                        }
                                    </div>
                                }
                            </div>

                            <div className="col">

                                {this.parentItem != "" && this.parentItem != "undefined" &&
                                     <a href="${this.parentItem}" target="_blank">Parent</a>
                                }

                            </div>

                        </div>

                    </div>

                </div>
                }

            </div>
        )
    }
}