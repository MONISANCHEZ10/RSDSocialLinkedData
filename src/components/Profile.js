import React from 'react'
import auth from 'solid-auth-client'
import datt from "@solid/query-ldflex";
import {namedNode} from "rdflib";
import { Input } from '@material-ui/core';
import Button from "@material-ui/core/Button";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import InputLabel from "@material-ui/core/InputLabel";
import GridList from "@material-ui/core/GridList";

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
            photos: []
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
        this.onDrop = this.onDrop.bind(this);
        this.inputNote = this.inputNote.bind(this);

    }

    componentWillMount() {
        auth.trackSession(session => {
            if(session){
                this.setState({ webId: session && session.webId });
                console.log(this.state.webId);
                const myWebId = datt[this.state.webId];
                console.log("*************")
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
        for await (const photo of me["vcard:hasPhoto"]) {
            let photos = datt[photo];
            console.log(photos.value);
            this.state.photos.push(photos.value)

        }
        for await (const email of me["vcard:hasEmail"]) {
            let mail = datt[email];
            let value = await mail["vcard:value"];
            value = `${value}`;
            this.state.email = value.split(":")[1];
            break
        }
        console.log(this.state)
        return this.setState(this.state);
    };
    async updatePhoto(uri) {
        try {
            const { user } = datt;
            await user.vcard_hasPhoto.set(namedNode(uri));
          //  successToaster(t('profile.uploadSuccess'), t('profile.successTitle'));
            alert("realizado");
        } catch (error) {
         //   errorToaster(error.message, t('profile.errorTitle'));
            alert("error")
        }
    };
    async updateProfileData(userData) {
        console.log(userData)
        let me = await datt[this.state.webId];
        await me.vcard_fn.set(userData.fn);
        await me["vcard:organization-name"].set(userData.company);
        await me["vcard:role"].set(userData.role);
        await me["vcard:note"].set(userData.note);
        for await (const emailId of me["vcard:hasEmail"]) {
            await datt[`${emailId}`].vcard$value.set(
                namedNode(`mailto:${userData.email}`)
            );
            break
        }
        for await (const phoneId of me["vcard:hasTelephone"]) {
            await datt[`${phoneId}`].vcard$value.set( namedNode(`tel:${userData.phone}`)
            );
            break
        }
        for await (const addresses of me["vcard:hasAddress"]) {
            console.log(addresses)
            console.log(datt[`${addresses}`])
            let country = "country-name"
            await datt[`${addresses}`]["http://www.w3.org/2006/vcard/ns#country-name"].set (`${userData.country}`);
            //https://forum.solidproject.org/t/question-about-retrieving-data/569/10   predicado compuesto
             await datt[`${addresses}`].vcard$region.set( `${userData.region}`);
             await datt[`${addresses}`]["http://www.w3.org/2006/vcard/ns#postal-code"].set( `${userData.postalCode}`);
             await datt[`${addresses}`]["http://www.w3.org/2006/vcard/ns#street-address"].set( `${userData.address}`);
             await datt[`${addresses}`].vcard$locality.set( `${userData.locality}`);

            break;
        }
        console.log(this.state)
    };

    async handleSave(e) {
        e.preventDefault();
        await this.updateProfileData(this.state);
        alert("Realizado")
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
    onDrop(picture) {
        this.setState({
            photos: this.state.photos.concat(picture),
        });
        console.log(this.state.photos)
    }

    /*    <ImageUploader
                    withIcon={true}
                    buttonText='Choose images'
                    onChange={this.onDrop}
                    imgExtension={['.jpg', '.gif', '.png', '.gif']}
                    maxFileSize={5242880}
                />
     */

    render() {
        const { webId } = this.state;
        const imgs = (this.state.photos||[]).map((photo,index)=>(

               <img src = {photo} width="200" ></img>

        ))
        return (
            <div item xs={12}>
                {imgs}
                <br/>
                {webId}
                <form onSubmit={this.handleSave} >

                            <InputLabel>NOMBRE:</InputLabel>
                            <Input type="text"   value={this.state.fn} onChange={this.webIdNewFriend} />

                            <InputLabel>SOBRE MI:</InputLabel>
                            <TextareaAutosize aria-label="minimum height" rowsMin={3} placeholder="Minimum 3 rows" value={this.state.note} onChange={this.inputNote}/>

                            <InputLabel>EMAIL:</InputLabel>
                            <Input type="email" value={this.state.email} onChange={this.inputEmail} />

                            <InputLabel>TELEFONO:</InputLabel>
                            <Input type="tel" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                                   placeholder="123-45-678"
                                   value={this.state.phone} onChange={this.inputPhone} />

                            <InputLabel>ROLE: </InputLabel>
                            <Input type="text" value={this.state.role} onChange={this.inputRole} />

                            <InputLabel>COMPANIA:</InputLabel>
                            <Input type="text" value={this.state.company} onChange={this.inputCompany} />

                             <InputLabel>DIRECCION:</InputLabel>
                             <Input type="text" value={this.state.address} onChange={this.inputAddress} />

                             <InputLabel>PAIS:</InputLabel>
                             <Input type="text" value={this.state.country} onChange={this.inputCountry} />

                             <InputLabel>LOCALLIDAD:</InputLabel>
                             <Input type="text" value={this.state.locality} onChange={this.inputLocality} />

                             <InputLabel>CODIGO POSTAL:</InputLabel>
                             <Input type="number" value={this.state.postalCode} onChange={this.inputPostalCode} />

                             <InputLabel>REGION:</InputLabel>
                             <Input type="text"   size="large"  defaultValue="Normal" value={this.state.region} onChange={this.inputRegion} />


                    <Button  type="submit"  variant="outlined" color="primary" size="large"  >Actualizar</Button>
                </form>

            </div>
        )
    }
}
