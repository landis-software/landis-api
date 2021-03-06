// XenForo API stuffs that works with GExtension and the impusle framework

wrapper = require("api-wrapper");
bluebird = require("bluebird");
//mysql = require("mysql")

// eh might be more ideal to fuck off with this and work it into ForumUser
class ProfilePost {

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

class Thread {

    on(event, callback) {
        if (event == "setup")
            this.__connectEvent = callback;
    }

    constructor(client,thread_id) {
        this.client = client;
        this.thread_id = thread_id;
        this.__connectEvent = () => { };
        this.data = {};
        this.client.API.getThreadAsync({ id: thread_id }, "").then((data) => {
            if (data.body) {
                this.data = JSON.parse(data.body).thread;
                this.__connectEvent(this.data)
            }
        })
    }
}

class ForumUser {

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

class Forum {
    
    get API() {
        return this.__api;
    }

    __getUser(id, callback) {
        forum.__api.getUser({
            id: id
        }, (_, __, userData) => {
            callback(userData);
        })
    }

    getThread(id,callback) {
        return this.__api.getThread({
            id: id
        }, "", (a, b, body) => {
            const author = new ForumUser(this, body.thread.user_id);
            callback(author,body)
        });
    }

    postToThread(id, message) {
        msg = escape(message);
        return this.API.postMessageAsync({
            thread_id: id,
            message: msg
        }, "");
    }

    constructor(token) {
        this.Token = token;
        
        this.__api = wrapper.create({
            root: "https://forums.landis-community.com/api/",
            parseJson: true,
            requestDefaults: {
                headers: { "XF-Api-Key": token }
            },
            get: {
                getThreads: "threads/",
                getThread: "threads/${id}/",
                getUser: "users/${id}/",
                getForum: "forums/${id}/threads/",
                getMessage: "posts/${id}/"
            },
            post: {
                makeProfilePost: "profile-posts/?user_id|message",
                setUserName: "users/${id}/?username",
                sendAlert: "alerts/",
                postMessage: "posts/?thread_id|message",
                updateThread: "threads/${id}/?prefix_id|title|discussion_open|sticky|custom_fields|add_tags|remove_tags",
                setThreadTag: "threads/${id}/?custom_fields[${tag_name}]=${tag_value}"
            }
        })
        this.__api = bluebird.promisifyAll(this.__api);
    }
}
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
const auth = require("./auth.json")
const forum = new Forum(auth.token);
const main = async () => {
    if (forum.__api == null) {
        console.log('fuck')
    }
    else
    {
        let foo = new Thread(forum, 5);
        foo.on("setup", (thread) => {
            console.log(thread);
        })
        //forum.postToThread(5,"this is a test message sent from the LANDIS API!!")
        /*let user = new ForumUser(forum, 269);
        user.on("connected", (data) => {
            user.postToProfile("Hello world!")
        })*/
    }
    await snooze(4000)
    main()
}
main()