
import React from 'react'
import auth from 'solid-auth-client'
import {AgentSolid} from "../lib/agent-solid";
import data from "@solid/query-ldflex";
import ChatItem from "./ChatItem";

export default class ChatElements extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pod : {instances: []},
            infoChat: { years: [], months: [], days: []},
            documents: []
        };

        this.name = "Chats";
        this.something = "Channels"
        this.webId = "https://eparedez.solid.community/profile/card#me"
        // this.pod = {instances: []}
        this.discover = {years:[], months:[], days: []}
        this.documents = [];
        this.chatOwner = this.webId;
        this.firstUpdated();
    }

    componentWillMount() {
        auth.trackSession(session => {
            if(session){
                // this.setState({ webId: session && session.webId });
            }
        });
    }


    open(e){

        console.log('open chat channel');

        this.resetDiscover()
        this.discover.url = e.target.getAttribute("url")
        this.discover.classe = e.target.getAttribute("classe")
        this.discover.folder = this.discover.url.substring(0,this.discover.url.lastIndexOf('/')+1)
        this.agent.send("Flow", {action: "discoverChanged", discover: this.discover})
        this.agent.send("Chat", {action: "discoverChanged", discover: this.discover})
        this.agent.send("InputSimple", {action: "discoverChanged", discover: this.discover})

        console.log(this.discover);
        this.setState({discover: this.discover})
        this.discoverChannelsInfo()

    }

    async discoverChannelsInfo(){
        var app = this

        switch(this.discover.classe) {
            case "http://www.w3.org/ns/pim/meeting#LongChat":
                app.socket = null
                await  this.openLongChat()
                break;
            case "http://schema.org/TextDigitalDocument":
            case "http://schema.org/MediaObject":
            case "http://www.w3.org/2002/01/bookmark#Bookmark":
            default:
                await this.openDefault()
        }
        // this.info=this.documents.length+" "+this.localName(this.discover.classe)+" at "
    }

    async openDefault(e){
        let documents = []
        this.documents = []
        for await (const subject of data[this.discover.url].subjects){
            //  console.log(`${subject}`);
            const doc = `${subject}`
            documents.push(doc)
        }
        this.documents = documents
        this.info=this.documents.length+" "+this.localName(this.discover.classe)+" at "
    }

    async openLongChat(e){
        console.log("openChat")
        var app = this
        var folder = this.discover.folder
        //YEAR
        var years = []
        for await (const year of data[folder]['ldp$contains']){
            //  console.log("YEAR",`${year}`);
            if ( `${year}`.endsWith('/')){
                var localyear = this.localName(`${year}`.slice(0, -1))
                years.push(localyear)
            }
        }
        //  console.log(years)
        var last_year = Math.max(...years)

        //MONTH
        var months = []
        for await (const month of data[folder+last_year+'/']['ldp$contains']){
            //  console.log("MONTH",`${month}`);
            if ( `${month}`.endsWith('/')){
                var localmonth = this.localName(`${month}`.slice(0, -1))
                months.push(localmonth)
            }
        }
        //  console.log(months)
        var last_month = ("0" + Math.max(...months)).slice(-2)

        //DAY
        var days = []
        for await (const day of data[folder+last_year+'/'+last_month+'/']['ldp$contains']){
            //  console.log("DAY",`${day}`);
            if ( `${day}`.endsWith('/')){
                var localday = this.localName(`${day}`.slice(0, -1))
                days.push(localday)
            }
        }
        //console.log(days)
        var last_day = ("0" + Math.max(...days)).slice(-2)
        //  console.log("Last day",last_day)

        this.discover.years = years.sort()
        this.discover.months = months.sort()
        this.discover.days = days.sort()
        this.discover.year = last_year
        this.discover.month = last_month
        this.discover.day = last_day

        this.setState({infoChat: this.discover})
        this.setState({ documents: this.documents})
        //  console.log(this.discover)
        //  this.documents =[]
        await this.showChat()
        this.info=this.documents.length+" "+this.localName(this.discover.classe)+" at "
        this.agent.send('Fab',  {action:"discoverChanged", discover: this.discover});
        //  this.agent.send('Input',  {action:"discoverChanged", discover: this.discover});
    }

    restore(){
        this.webIdChanged("https://solidarity.inrupt.net/profile/card#me")
    }

    resetDiscover(){
        var dateObj = new Date();
        var month = ("0" + dateObj.getUTCMonth() + 1).slice(-2); //months from 1-12
        var day = ("0" + dateObj.getUTCDate()).slice(-2);
        var year = dateObj.getUTCFullYear();
        this.discover.year = year
        this.discover.month = month
        this.discover.day = day
        this.discover.years = []
        this.discover.months = []
        this.discover.days = []
        this.discover.loop = 10
    }

    firstUpdated(){
        var app = this;
        this.init();
        this.agent = new AgentSolid(this.name);
        this.agent.receive = function(from, message) {
            //  console.log("messah",message)
            if (message.hasOwnProperty("action")){
                //  console.log(message)
                switch(message.action) {
                    case "webIdChanged":
                        app.webIdChanged(message.webId)
                        break;
                    case "podChanged":
                        app.podChanged(message.pod)
                        break;
                    default:
                        console.log("Unknown action ",message)
                }
            }
        };
    }

    webIdChanged(webId){
        this.webId = webId
        console.log(webId)
        if (this.webId != null){
            this.init()
        }
    }

    async init(){
        var p = {}
        console.log(this.webId)
        if (this.webId != null){
            //https://github.com/solid/query-ldflex/blob/master/demo/user.html
            p.webId = `${this.webId}`
            //  console.log("###",p)
            const n = await data[this.webId].vcard$fn || p.webId.split("/")[2].split('.')[0];
            const img = await data[this.webId].vcard$hasPhoto || "";
            const inbox = await data[this.webId].inbox;
            const storage = await data[this.webId].storage;
            p.name = `${n}`
            p.img = `${img}`
            p.inbox = `${inbox}`
            p.storage = `${storage}`
            //  p.publicIndex = `${publicTypeIndex}`
            //  this.pod = p
            const publicTypeIndex = await data[this.webId].publicTypeIndex || "undefined"
            //  console.log(`${publicTypeIndex}`);

            let instances = []
            try{
                if (`${publicTypeIndex}` != "undefined"){

                    for await (const subject of data[publicTypeIndex].subjects){
                        //  console.log(`${subject}`);
                        if (`${publicTypeIndex}` != `${subject}`) {
                            const s = {subject: `${subject}`}
                            for await (const property of subject.properties)
                            {
                                if (`${property}` == "http://www.w3.org/ns/solid/terms#instance")    {
                                    //  console.log( "--",`${property}`);
                                    const instance = await data[subject][`${property}`]
                                    const classe = await data[subject].solid$forClass
                                    //  console.log( "--nn",`${instance}`);
                                    s.predicate = `${property}`
                                    s.object = `${instance}`
                                    s.classe = `${classe}`
                                    s.shortClasse = this.localName(s.classe)
                                }
                            }
                            if(s.shortClasse == "LongChat"){
                                instances.push(s)
                            }

                        }
                    }
                }
            }catch(e){
                console.log(e)
            }

            instances.sort(function(a, b) { //tri par date
                console.log(a.shortClasse,b.shortClasse)
                return a.shortClasse - b.shortClasse;
            });
            p.instances = instances
            // this.pod = p
            console.log(p);
            this.setState({pod : p});
           // console.log(this.pod)

        }
    }

    cutStorage(str){
        var splitted = str.split("/")
        return splitted[4]
    }

    localName(str){
        var ln = str.substring(str.lastIndexOf('#')+1);
        //console.log(ln)
        ln == str ? ln = str.substring(str.lastIndexOf('/')+1) : "";
        return ln
    }

    async showChat(){
        var app = this
        var path = this.discover.folder+[this.discover.year,this.discover.month,this.discover.day,""].join('/')
        //  console.log(path)
        //console.log("Clear")
        await data.clearCache()
        let chatfile = await data[path]['ldp$contains'];
        //  console.log("ChatFile",`${chatfile}`);
        this.info = "Looking for chatfile"
        this.documents = []
        var docs = []
        var discovurl = app.discover.url
        for await (const subject of data[chatfile].subjects){
            //  console.log("subject", `${subject}` );
            if ( `${subject}` != discovurl){ // ne semble pas fonctionner ??
                docs = [... docs, `${subject}`]
                //console.log(docs)
            }
        }
        //  console.log(docs)

        this.documents = docs
        //  this.requestUpdate()

        this.setState({ documents: this.documents})
        //  setInterval(this.updateScroll(scroller),1000);

        this.info=this.documents.length+" "+this.localName(this.discover.classe)+" at "
        this.scroll = false;

    }

    async  setCurrentYear(e){
        this.info="Updating Year"
        var y = e.target.getAttribute('year')
        this.discover.year = y
        this.documents =[]
        await this.showChat()
    }

    async setCurrentMonth(e){
        this.info="Updating Month"
        var m = e.target.getAttribute('month')
        this.discover.month = m
        this.documents =[]
        await this.showChat()
    }
    async setCurrentDay(e){
        this.info="Updating Day"
        var d = e.target.getAttribute('day')
        this.discover.day = d
        this.documents =[]
        await this.showChat()
    }

    render() {

        const {  pod, infoChat, documents } = this.state;
        console.log(pod);
        return (
            <div>

                {pod.instances.length>0 ?
                    (
                        <ul className="nav nav-pills">
                            {pod.instances.map((i) => {
                                return <li class="active">
                                    <button type="button"
                                            key={i}
                                            class="btn btn-success btn-sm"
                                            url={i.object}
                                            onClick={this.open.bind(this)}
                                            classe={i.classe}>
                                    {this.cutStorage(i.object)}
                                    {i.shortClasse.toLowerCase()}
                                    </button>
                                </li>
                            })
                            }
                        </ul>



                    )
                :
                    (
                        <p>Loading instances... Please wait & if it's too long refresh...</p>
                    )

            }


                <div className="row">
                    {infoChat.years.map((y) => {
                        return <button key={y} type="button" className="btn btn-primary btn-sm" onClick={this.setCurrentYear.bind(this)} year={y}>{y}</button>
                    })
                    }


                    {infoChat.months.map((m) => {
                        return <button key={m} type="button" className="btn btn-primary btn-sm" onClick={this.setCurrentMonth.bind(this)} month={m} >{m}</button>
                    })
                    }

                    {this.discover.days.map((d) => {
                        return <button type="button" className="btn btn-primary btn-sm" onClick={this.setCurrentDay.bind(this)} day={d} >{d}</button>
                    })
                    }

                    {/*{this.discover.folder != undefined &&*/}
                    {/*    <div>*/}
                    {/*        <a className="btn btn-primary btn-sm" href={this.discover.folder} target="_blank">*/}
                    {/*            <i className="fas fa-link"></i>*/}
                    {/*        </a>*/}
                    {/*        <a className="btn btn-primary btn-sm"*/}
                    {/*           href={"https://scenaristeur.github.io/spoggy-simple/?source=" + this.discover.folder}*/}
                    {/*           target="_blank">*/}
                    {/*            <i className="fas fa-project-diagram"></i>*/}
                    {/*        </a>*/}
                    {/*    </div>*/}

                    {/*}*/}
`

                </div>


                {documents.length > 0 &&

                    <div className="row">

                        <ul className="list-group  list-group-flush">
                            {documents.map((d, index) => {
                               return d.split('#').length > 1 && d.split('#')[1].startsWith('Msg') &&
                                    <li key={d} className="list-group-item border-bottom-0 p-0">
                                        <ChatItem url={d}  chatOwner={this.chatOwner} discover={this.discover} webId={this.webId} />
                                    </li>

                            })
                            }
                        </ul>

                    </div>

                }

            </div>
        )
    }

}
