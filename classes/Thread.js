export class Thread {

    on(event, callback) {
        this._events[event] = callback;
    }

    constructor(client,thread_id) {
        this.client = client;
        this.thread_id = thread_id;
        this.__connectEvent = () => { };
        this.data = [];
        this._events = [];
        this.client.API.getThreadAsync({ id: thread_id }, "").then((data) => {
            if (data.body) {
                this.data = JSON.parse(data.body).thread;
                if (this._events.setup != undefined) {
                  this._events.setup(this.data)
                }
            }
        })
    }
}
