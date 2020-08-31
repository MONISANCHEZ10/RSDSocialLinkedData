import datt from "@solid/query-ldflex";
import {namedNode} from "rdflib";
import {fetchDocument} from "tripledoc";
import {foaf, vcard} from "rdf-namespaces";
import auth from "solid-auth-client";
import {NotificationManager} from "react-notifications";
import * as rdf from "rdflib";
const $rdf = require('rdflib')
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const VCARD = rdf.Namespace("http://www.w3.org/2006/vcard/ns#");

var Helpers = {


    // Functions get and update profile

    async getProfileData(webId) {
        let dataWebId = {}
        const me = datt[webId];
        dataWebId.fn = `${await me.vcard_fn}`;
        dataWebId.url = `${await me["solid:account"]}`.concat("profile/card#");
        dataWebId.image = `${await me["vcard:hasPhoto"]}`;
        dataWebId.company = `${await me["vcard:organization-name"]}`;
        dataWebId.role = `${await me["vcard:role"]}`;
        dataWebId.note = `${await me["vcard:note"]}`;
        for await (const addresses of me["vcard:hasAddress"]) {
            console.log("dentro del for addredsss")
            let address = datt[addresses];
            let locality =  address["vcard:locality"];
            dataWebId.locality = `${await locality}`;
            let country =  address["vcard:country-name"];
            dataWebId.country = `${await country}`;
            let region =  address["vcard:region"];
            dataWebId.region = `${await region}`;
            let postalCode =  address["vcard:postal-code"];
            dataWebId.postalCode = `${await postalCode}`;
            let streetAddress =  address["vcard:street-address"];
            dataWebId.address = `${await streetAddress}`;
            break;
        }
        for await (const phone of me["vcard:hasTelephone"]) {
            console.log("dentro del for telefono")
            let pho = datt[phone];
            let value = await pho["vcard:value"];
            value = `${value}`;
            dataWebId.phone = value.split(":")[1];
            break
        }
        for await (const email of me["vcard:hasEmail"]) {
            console.log("dentro del for mail")
            let mail = datt[email];
            let value = await  mail["vcard:value"];
            value = `${value}`;
            dataWebId.email = value.split(":")[1];
            break
        }
        console.log("GET DATA PROFILE : ")
        console.log(dataWebId)
        return dataWebId;
    },



    async updateProfileData(userData) {
        let me = await datt[userData.webId];
        await me.vcard_fn.set(userData.fn);
        await me["vcard:organization-name"].set(userData.company);
        await me["vcard:role"].set(userData.role);
        await me["vcard:note"].set(userData.note);
        for await (const emailId of me["vcard:hasEmail"]) {
            await datt[`${emailId}`].vcard$value.set(
                namedNode(`mailto:${userData.email}`)
            ); break
        }
        for await (const phoneId of me["vcard:hasTelephone"]) {
            await datt[`${phoneId}`].vcard$value.set( namedNode(`tel:${userData.phone}`)
            );break
        }
        for await (const addresses of me["vcard:hasAddress"]) {
            let country = "country-name"
            await datt[`${addresses}`]["http://www.w3.org/2006/vcard/ns#country-name"].set (`${userData.country}`);
            await datt[`${addresses}`].vcard$region.set( `${userData.region}`);
            await datt[`${addresses}`]["http://www.w3.org/2006/vcard/ns#postal-code"].set( `${userData.postalCode}`);
            await datt[`${addresses}`]["http://www.w3.org/2006/vcard/ns#street-address"].set( `${userData.address}`);
            await datt[`${addresses}`].vcard$locality.set( `${userData.locality}`); break;
        }
        return userData;
    },

    // Functions get , add and remove friends

    async getFriends(person) {
        console.log("lenyendo amigos")
        let friendsTemp = [];
        for await (const name of person.friends){
            console.log("FOOOOR amigos")
            const webIdDoc = await fetchDocument(name);
            const profile = webIdDoc.getSubject(name);
            let card = {
                'name': profile.getString(foaf.name),
                'firstname': profile.getString(foaf.aimChatID),
                'webId': name.toString(),
                'img': profile.getRef(vcard.hasPhoto),
            }

            friendsTemp.push(card);
        }
        console.log("mis amigos")
        console.log(friendsTemp)
        return  friendsTemp;
    },

    async  addOrRemoveFriend(webId, action){
    await  auth.trackSession(session => {
        if(session){
            const doc = $rdf.sym(session.webId.split('#')[0]);
            const add = $rdf.st($rdf.sym(session.webId), $rdf.sym(FOAF('knows')), $rdf.sym(webId), doc);
            let insertions = [];
            let deletions = [];
            try {
                if(action === "insertions"){
                    insertions.push(add);
                    alert("WEB ID "+ webId);
                }
                else  {
                    deletions.push(add);
                    alert("AMIGO ELIMANDO   "+ webId);
                    NotificationManager.success( " REALIZADO")
                }
                this.updateManager = new $rdf.UpdateManager(this.store);
                this.updateManager.update(deletions, insertions, (uri, success, message) => {
                    if (!success) {
                        console.log('Error: ' + message);
                    }
                });
            } catch (error) {
                console.log(`Error adding data: ${error}`);
            }
        }
    });
}


    // add the functions do you need


}

export default Helpers;