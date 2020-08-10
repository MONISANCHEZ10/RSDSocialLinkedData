import React from 'react'
import auth from 'solid-auth-client'
import datt from "@solid/query-ldflex";
import InputLabel from "@material-ui/core/InputLabel";
import GridList from "@material-ui/core/GridList";



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

    }

    async componentWillMount() {
         await auth.trackSession(session => {
            if(session){
                this.setState({ webId: session && session.webId });
                const myWebId = datt[this.state.webId];
                this.getProfileData(myWebId)
            }
        });
    }

    async  getProfileData (webId)  {
        // TODO this could be refactor to do not have to await for each of the individual promises
        const me = datt[webId];
        this.state.fn = `${await me.vcard_fn}`; // Fullname
        this.state.url = `${await me["solid:account"]}`.concat("profile/card#");
        this.state.image = `${await me["vcard:hasPhoto"]}`;
        this.state.company = `${await me["vcard:organization-name"]}`;
        this.state.role = `${await me["vcard:role"]}`;
        this.state.note = `${await me["vcard:note"]}`;
        for await (const addresses of me["vcard:hasAddress"]) {
            let address = datt[addresses];
            let locality = await address["vcard:locality"];
            this.state.locality  = `${locality}`;
            let country = await address["vcard:country-name"];
            this.state.country  = `${country}`;
            let region = await address["vcard:region"];
            this.state.region  = `${region}`;
            let postalCode = await address["vcard:postal-code"];
            this.state.postalCode  = `${postalCode}`;
            let streetAddress = await address["vcard:street-address"];
            this.state.address  = `${streetAddress}`;
            break;
        }
        for await (const phone of me["vcard:hasTelephone"]) {
            let pho = datt[phone];
            let value = await pho["vcard:value"];
            value = `${value}`;
            this.state.phone = value.split(":")[1];
            break
        }
        for await (const email of me["vcard:hasEmail"]) {
            let mail = datt[email];
            let value = await mail["vcard:value"];
            value = `${value}`;
            this.state.email = value.split(":")[1];
            break
        }
        return this.setState(this.state);
    };

    render() {
        const { webId } = this.state;
        return (
            <div>


                <img src = {this.state.image} width="250" ></img>
                <InputLabel>MI WEB ID: {webId}</InputLabel>

                <GridList cellHeight={160}  cols={2}>

                </GridList>

                <InputLabel>NOMBRE: {this.state.fn}</InputLabel>
                <InputLabel>SOBRE MI: {this.state.note}</InputLabel>
                <InputLabel>EMAIL: {this.state.email}</InputLabel>
                <InputLabel>TELEFONO: {this.state.phone}</InputLabel>
                <InputLabel>ROL: {this.state.role}</InputLabel>
                <InputLabel>COMPANIA: {this.state.company}</InputLabel>
                <InputLabel>DIRECCION: {this.state.address}</InputLabel>
                <InputLabel>PAIS: {this.state.country}</InputLabel>
                <InputLabel>LOCALIDAD: {this.state.locality}</InputLabel>
                <InputLabel>CODIGO POSTAL: {this.state.postalCode}</InputLabel>
                <InputLabel>REGION: {this.state.region}</InputLabel>




            </div>
        )
    }
}
