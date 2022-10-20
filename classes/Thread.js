Node = require("./Node.js");

class Thread {
	
	// Returns <Promise>
	reply(message) {
		return this.client.postToThread(this.thread_id, message);
	}

	on(event, callback) {
		this._events[event] = callback;
	}

	constructor(client,thread_id) {
		this.client = client;
		this.thread_id = thread_id;
		this.__connectEvent = () => { };
		this.data = [];
		this._events = [];
		this.ParentNode = undefined;
		this.client.API.getThreadAsync({ id: thread_id }, "").then((data) => {
			if (data.body) {
				this.data = JSON.parse(data.body).thread;
				this.ParentNode = new Node(this.client, this.data.node_id);
				if (this._events.setup != undefined) {
				  this._events.setup(this.data)
				}
			}
		})
	}
}
module.exports = Thread;