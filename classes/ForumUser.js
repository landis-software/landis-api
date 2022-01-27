export class ForumUser {

    get dat() {
        return this.__data.user;
    }

    get id() {
        return this.dat.user_id;
    }

    get username() {
        return this.dat.username;
    }
    get staff() {
        return this.dat.is_staff;
    }

    on(event, callback) {
        if (event == "connected")
            this.__connectEvent = callback;
    }
    
    setUsername(name) {
        return this.__forum.__api.setUserNameAsync({
            id: this.dat.user_id,
            username: name
        }, "").then((a) => {
                if (a.body) {
                    let data = JSON.parse(a.body)
                    if (data.success) {
                        console.log('User[' + this.id.toString() + '] username changed successfully.')
                        this.__data.user.username = name;
                    } else {
                        console.warn('User[' + this.id.toString() + '] username changed successfully.')
                    }
                }
            })
    }

    // async
    // writes a profile post to the user sent from the account linked with API key, does NOT work if no account is associated with  the API key
    postToProfile(message) {
        let profilePost = new ProfilePost(this.__forum);
        //profilePost.content = "Hello World";
        profilePost.post(this,message);
    }

    set username(name) {
        return this.setUsername(name);
    }

    constructor(forum, id) {
        this.__forum = forum;
        this.__id = id;
        this.__data = {};
        forum.__api.getUserAsync({ id: id })
        .then((userData) => {
            //console.log(userData)
            this.__data = JSON.parse(userData.body);
            if (this.__connectEvent)
                this.__connectEvent(this.dat);
        })
    }
}
