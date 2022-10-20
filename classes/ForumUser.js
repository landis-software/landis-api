/* Require Libs */
class ForumUser {

	get API() {
		return this.__forum.API;
	}

	get dat() {
		return this.__data.user;
	};

	get id() {
		return this.dat.user_id;
	};

	get username() {
		return this.dat.username;
	};

	get staff() {
		return this.dat.is_staff;
	};

	on(event, callback) {
		if (event == "connected")
			this.__connectEvent = callback;
	};

	setUsername(name) {
		let params = {
			id: this.dat.user_id,
			username: name
		};
		return this.API.setUserNameAsync(params, "")
			.then(response => {
				if (response.body) {
					let data = JSON.parse(response.body)
					if (data.success) {
						console.log('User[' + this.id.toString() + '] username changed successfully.')
						this.__data.user.username = name;
					} else {
						console.warn('User[' + this.id.toString() + '] username change failed.')
					}
				}
			});
	};

	// async
	// writes a profile post to the user sent from the account linked with API key, does NOT work if no account is associated with  the API key
	postToProfile(message) {
		let profilePost = new ProfilePost(this.__forum);
		profilePost.post(this, message);
	};

	set username(name) {
		return this.setUsername(name);
	};

	constructor(forum, id) {
		this.__forum = forum;
		this.__id = id;
		this.__data = {};
		let params = { id: id };
		forum.API.getUserAsync(params)
			.then((userData) => {
				//console.log(userData)
				this.__data = JSON.parse(userData.body);
				if (this.__connectEvent)
					this.__connectEvent(this.dat);
			})
	}
}
module.exports = ForumUser;