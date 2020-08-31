import React from "react";
import data from "@solid/query-ldflex";


export default class ChatItem2 extends React.Component{


    constructor(props) {
        super(props);
        this.state = {
            maker: '',
            makername: '',
            content: '',
            parentItem: '',
            makerimg: [],
            comments: [],
            types: []
        };

        this.something = "Doc Element"
        this.url = props.url;
        //this.webId = props.webId;
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
        //this.discover = props.discover;
        console.log(props)
        //this.chatOwner = props.chatOwner;

        this.setState({discover: props.discover})
        this.setState({chatOwner: props.chatOwner})
        this.setState({chatOwner: props.chatOwner})
        //this.setState({url: props.url})


        this.firstUpdated()
    }

    firstUpdated(){
        var app = this;
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
                        this.setState({
                            maker: app.maker,
                            makername: app.makername,
                            makerimg: app.makerimg
                        })
                        break;
                    case "http://purl.org/dc/terms/created":
                        var date = await data[this.url][`${property}`]
                        app.date = `${date}`
                        break;
                    case "http://rdfs.org/sioc/ns#content":
                        var content = await data[this.url][`${property}`]
                        app.content = `${content}`
                        this.setState({
                            content: app.content,
                        })
                        break;
                    case "http://www.w3.org/2000/01/rdf-schema#type":
                        for await (const type of data[this.url][`${property}`])
                        {
                            //  console.log("Type",`${type}`)
                            app.types = [... app.types, `${type}`]
                        }
                        this.setState({
                            types: app.types,
                        })
                        break;
                    case "http://schema.org/parentItem":
                    case "http://schema.org/target":
                        var parentItem = await data[this.url][`${property}`]
                        app.parentItem = `${parentItem}`
                        this.setState({
                            parentItem: app.parentItem,
                        })
                        break;
                    case "http://schema.org/comment":
                        for await (const comment of data[this.url][`${property}`])
                        {
                            //  console.log("Comment",`${comment}`)
                            app.comments = [... app.comments, `${comment}`]
                        }

                        this.setState({
                            comments: app.comments,
                        })
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


    render(){
        const { makerimg, maker, makername, content, comments, types, parentItem } = this.state;

        console.log(this.state)

        return (
            <div className="row">
                <div className="col-1">
                    <a href={maker} target="_blank">

                        {makerimg.length > 0 ?
                            (
                                <img className="rounded-circle user_img_msg"
                                     src={"//images.weserv.nl/?url=" + makerimg + "&w=32&h=32"}
                                     title={makerimg}
                                     alt="no image"/>
                            ) :
                            (
                                <i className="fas fa-user-circle fa-2x" title={makername}></i>
                            )
                        }

                    </a>
                </div>

                <div className="col">
                    <div style={{position: 'absolute', width:'auto', height:'auto', textAlign:'left'}}>
                        <font face="Arial, Helvetica, sans-serif" style={{color: '#855FFA', fontSize:'13px', fontWeight: 'bold'}}>
                            <span>{this.makername}
                            </span> </font></div>

                    <div style={{position: 'relative', paddingTop:'15px', paddingBotton:'5px', width:'auto', height:'auto', textAlign:'left'}}>
                        <font face="Arial, Helvetica, sans-serif">
                            <span>
                            {content}
                            </span>
                        </font></div>
                </div>

                <div className="col-2">
                    <div className="row">
                        <font face="Arial, Helvetica, sans-serif" style={{color:'#A5A5A5', fontSize: '13px', fontWeight: 'bold'}}>
                            <div class="col text-left" style={{top: '20px'}} >{new Date(this.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div> </font>
                        <div className="col text-right" style={{top: '20px'}}>
                            <i className="fas fa-reply" onClick={this.reply}></i>
                        <i className="fas fa-ellipsis-v"></i></div>
                </div>

                    {types.length > 0 &&
                        types.map((t, index) => {
                        return <button type="button" key={index} className="btn btn-outline-dark btn-sm">{this.localName(t)}</button>
                    })
                    }

                    {comments.length > 0 &&
                    <div className="row font-weight-light">
                        {comments.map((c, index) => {
                            return <a href={c} target="_blank">{index}</a>
                        })
                        }
                    </div>
                    }

                    {parentItem != "" && parentItem != "undefined" &&
                    <a href={parentItem} target="_blank">Parent</a>
                    }
            </div>

            </div>
        )
    }

}