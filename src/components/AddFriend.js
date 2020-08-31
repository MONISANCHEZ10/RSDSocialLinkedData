import auth from "solid-auth-client";
import data from "@solid/query-ldflex";
import FC from "solid-file-client";
import { NotificationManager } from "react-notifications";

class AddFriend {
    constructor() {
        this.webId = "";
        this.friends = this.getFriends();
    }

    async addFriend(id, webId, added, empty, error) {
        var ret = 0;
        const user = data[webId]; //sacamos nuestra informacion
        if (await this.checkID(id)) {
            if (id.localeCompare("") !== 0) {
                //comprobamos que no pasamos un campo vacio
                if (await this.friendAlreadyAdded(id, webId)) {
                    //notificamos si el amigo estaba añadido
                    NotificationManager.error("", added, 3000);

                    ret = -1;
                } else {
                    await user.knows.add(data[id]); //añadimos el amigo
                    ret = 1;
                }
            } else {
                NotificationManager.error("", empty, 3000);
                ret = -1;
            }
        } else {
            NotificationManager.error("", error, 3000);
            ret = -1;
        }
        return await ret;
    }

    async removeFriend(event, webId, eliminado, error) {
        try {
            var selectedOption = document.querySelector("input[name = food]:checked")
                .value; //sacamos el amigo seleccionado
            event.preventDefault();
            const user = data[webId]; //sacamos nuestra informacion
            if (selectedOption.localeCompare("") !== 0) {
                await user.knows.delete(data[selectedOption]); //eliminamos el amigo
                NotificationManager.error("", eliminado, 3000);
            }
        } catch (e) {
            NotificationManager.error("", error, 3000);
        }
    }

    async checkID(id) {
        const fc = new FC(auth);
        let session = await auth.currentSession();
        if (!session) {
            session = await auth.login();
        }
        try {
            let op = async (client) => await client.itemExists(id);
            return await op(fc);
        } catch (e) {
            session = await auth.currentSession();
        }
    }

    async friendAlreadyAdded(id, webId) {
        const user = data[webId];
        for await (const friend of user.friends)
            if (String(friend).localeCompare(String(id)) === 0) return true;
        return false;
    }
    async getFriends() {
        const friends = [];
        let session = await auth.currentSession();
        if (session) {
            var id = `${session.webId}`;
            const user = data[id];
            for await (const friend of user.friends) friends.push(friend.toString());
            const users = await Promise.all(friends);
            return users;
        }
    }
}
export default AddFriend = new AddFriend();