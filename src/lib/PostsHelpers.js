
import {foaf, rdf, schema, space, vcard} from "rdf-namespaces";
import  { fetchDocument, createDocument } from 'tripledoc';
import auth from 'solid-auth-client'
import Helpers from "./helpers";
import {
    createAclFromFallbackAcl, getResourceAcl,
    getSolidDatasetWithAcl,
    hasAccessibleAcl,
    hasFallbackAcl,
    hasResourceAcl, saveAclFor, setPublicResourceAccess
} from "@inrupt/solid-client";
import data from "@solid/query-ldflex";

const $rdf = require('rdflib')
const FC   = require('solid-file-client')
const fc   = new FC( auth )


const acl = {
    Authorization: "http://www.w3.org/ns/auth/acl#Authorization",
    Read: "http://www.w3.org/ns/auth/acl#Read",
    Append: "http://www.w3.org/ns/auth/acl#Append",
    Write: "http://www.w3.org/ns/auth/acl#Write",
    Control: "http://www.w3.org/ns/auth/acl#Control",
    accessTo: "http://www.w3.org/ns/auth/acl#accessTo",
    agent: "http://www.w3.org/ns/auth/acl#agent",
    agentClass: "http://www.w3.org/ns/auth/acl#agentClass",
    default__workaround: "http://www.w3.org/ns/auth/acl#default",
    defaultForNew: "http://www.w3.org/ns/auth/acl#defaultForNew",
    mode: "http://www.w3.org/ns/auth/acl#mode",
    origin: "http://www.w3.org/ns/auth/acl#origin"
};


var PostsHelpers = {


    async  getPosts2(webId) {
        const webIdDoc = await fetchDocument(webId);
        const profile = webIdDoc.getSubject(webId);
        const storage = profile.getRef(space.storage);
        let url = `${storage}public/posts2/`;
        const filePosts = (await fc.readFolder(url)).files;
        let posts = [];
        for (const item of filePosts) {

            let content = await  fetchDocument(item.url)
            let readContent = content.getAllSubjectsOfType(schema.TextDigitalDocument);

            console.log("CONTENIDO")
            console.log(readContent)
            posts.push(readContent[0])
        }
        console.log(posts)
        return posts.reverse();
    },

    async  addNote(webId, note, fileImage) {
        let visibleFor = "public";
        const webIdDoc = await fetchDocument(webId);
        const profile = webIdDoc.getSubject(webId);
        console.log("CREANDO DOCUMENT0");
        const storage = profile.getRef(space.storage);
        let time = new Date().getTime();
        console.log("TIME ", time)
        const notesListRef = storage + "public/posts2/"+time+".ttl";
        const notesList = createDocument(notesListRef);
        const typeRegistration = notesList.addSubject(notesListRef);
        typeRegistration.addRef(rdf.type, schema.TextDigitalDocument);
        typeRegistration.addString(schema.dateCreated, new Date(Date.now()).toString().substring(0, 21));
        typeRegistration.addString(schema.text, note);
        typeRegistration.addString(schema.additionalName, notesListRef);
        typeRegistration.addString(schema.publicAccess, visibleFor);
        typeRegistration.addInteger(schema.arrivalTime, time);
        if(fileImage !== null){
            const storage = profile.getRef(space.storage);
            const notesListRef = storage + "public/posts2/images/";
            const sendTo =notesListRef + fileImage.file.name
            await fc.copyFile(fileImage.dataURL, sendTo  )
            alert("realizado imagen cargada a public");
            typeRegistration.addRef(schema.image, sendTo);
        }
        await notesList.save([typeRegistration]);
        await this.aclForPublic(notesListRef);
        alert("DOCUMENTOS Y POST CREADO..... "+ notesListRef)
    },

    // ACL

    async aclOnlyForMe( doc){
        await  auth.trackSession(session => {
            if(session){
                alert("permiso solo para mi")
                let nameAcl = doc+".acl";
                console.log(nameAcl)
                const dataFolder =  createDocument(nameAcl)
                const dataFolderACL = dataFolder.addSubject();
                dataFolderACL.addRef(rdf.type, acl.Authorization)
                dataFolderACL.addRef(acl.accessTo, doc)
                dataFolderACL.addRef(acl.agent, session.webId)
                dataFolderACL.addRef(acl.default__workaround,doc)
                dataFolderACL.addRef(acl.mode, acl.Read);
                dataFolderACL.addRef(acl.mode, acl.Write);
                dataFolderACL.addRef(acl.mode, acl.Control);
                dataFolderACL.addRef(acl.origin, "http://localhost:8083");
                dataFolder.save([dataFolderACL])
            }})
    },

    async aclForFriends(doc){
        await  auth.trackSession(session => {
                if(session){
                     this.aclOnlyForMe(doc)
                    let nameAcl = doc+".acl";
                    fetchDocument(nameAcl).then(dataFolder=> {
                        console.log("enocntrado el acl")
                        let user = data[session.webId];
                        Helpers.getFriends(user).then(friends=>{
                            const dataFolderACL = dataFolder.addSubject();
                            dataFolderACL.addRef(rdf.type, acl.Authorization)
                            dataFolderACL.addRef(acl.accessTo, doc)
                            dataFolderACL.addRef(acl.agent, session.webId)
                            for  (let item of friends){
                                dataFolderACL.addRef(acl.agent, item.webId)
                                console.log("asignado permiso a amiogs")
                            }
                            dataFolderACL.addRef(acl.default__workaround,doc)
                            dataFolderACL.addRef(acl.mode, acl.Read);
                            dataFolderACL.addRef(acl.origin, "http://localhost:8083");
                            dataFolder.save([dataFolderACL])

                        });
                    })
                }})
    },

    async aclForPublic(doc){
        const myDatasetWithAcl = await getSolidDatasetWithAcl(doc);
        let resourceAcl;
        if (!hasResourceAcl(myDatasetWithAcl)) {
            if (!hasAccessibleAcl(myDatasetWithAcl)) {
                throw new Error(
                    "The current user does not have permission to change access rights to this Resource."
                );
            }
            if (!hasFallbackAcl(myDatasetWithAcl)) {
                throw new Error(
                    "The current user does not have permission to see who currently has access to this Resource."
                );
            }
            resourceAcl = createAclFromFallbackAcl(myDatasetWithAcl);
        } else {
            resourceAcl = getResourceAcl(myDatasetWithAcl);
        }
        const updatedAcl = setPublicResourceAccess(
            resourceAcl,
            { read: true, append: false, write: false, control: false },
        );
        await saveAclFor(myDatasetWithAcl, updatedAcl);
    },

    async changeAccess(doc, level){
        if(level=== "public"){
            console.log("a publico")
            await PostsHelpers.aclForPublic(doc)
        }
        else if(level === "friends"){
            console.log("oa mis amigos")
            await PostsHelpers.aclForFriends(doc);
        }
        else {
            console.log("solo me")
            await PostsHelpers.aclOnlyForMe(doc);
        }
        let readline = (await fc.readFile(doc)).split("\n")
        console.log("CONSOLE DE ACL :")
        readline.map(function(item, index) {
            if(item.indexOf("publicAccess" ) >= 0){
                let lineAccess = item.split('"')
                readline[index] = lineAccess[0]+ '"'+level+'"'+lineAccess[2]
            }
        });
        await fc.putFile(doc, readline.join("\n"), "text/turtle");

    },





    // add the functions do you need


}
export default PostsHelpers;