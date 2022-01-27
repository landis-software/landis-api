// eh this SUCKS!
export class ProfilePost {

    send(user,content) {
        if (user instanceof ForumUser) {
            return this.client.__api.makeProfilePostAsync({
                user_id: user.dat.user_id,
                message: content
            }, "");
        }
    }

    constructor(client) {
        this.client = client;
    }
}
