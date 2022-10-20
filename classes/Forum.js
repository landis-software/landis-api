/* Require Libs */
wrapper = require("api-wrapper");
bluebird = require("bluebird");

class Forum {

	get API() {
		return this.__api;
	};

	__getUser(id, callback) {
		let params = { id: id };
		this.__api.getUser(params, (_, __, userData) => {
			callback(userData);
		})
	};

	getThread(id, callback) {
		return this.__api.getThread({
			id: id
		}, "", (a, b, body) => {
			const author = new ForumUser(this, body.thread.user_id);
			callback(author, body)
		});
	};

	postToThread(id, message) {
		msg = escape(message);
		return this.API.postMessageAsync({
			thread_id: id,
			message: msg
		}, "");
	};

	on(event, callback) {
		this._events[event] = callback;
	};

	constructor(token) {
		this.Token = token;

		this.__api = wrapper.create({
			root: "https://forums.landis-community.com/api/",
			parseJson: true,
			requestDefaults: {
				headers: {
					"XF-Api-Key": token
				}
			},
			get: {
				getThreads: "threads/",
				getThread: "threads/${id}/",
				getUser: "users/${id}/",
				getForum: "forums/${id}/threads/",
				getMessage: "posts/${id}/",
				getNode: "nodes/${id}/"
			},
			post: {
				makeProfilePost: "profile-posts/?user_id|message",
				setUserName: "users/${id}/?username",
				sendAlert: "alerts/",
				postMessage: "posts/?thread_id|message",
				updateThread: "threads/${id}/?prefix_id|title|discussion_open|sticky|custom_fields|add_tags|remove_tags",
				setThreadTag: "threads/${id}/?custom_fields[${tag_name}]=${tag_value}"
			}
		});
		this.__api = bluebird.promisifyAll(this.__api);
	}
};

module.exports = Forum;