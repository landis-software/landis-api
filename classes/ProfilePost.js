class ProfilePost {

	send(user, content) {
		if (user instanceof ForumUser) {
			let params = { user_id: user.dat.user_id, message: content };
			return this.client.__api.makeProfilePostAsync(params, "");
		};
	};

	constructor(client, id) {
		this.client = client;

		if (id != undefined) {
			this.is_existing = true;
			this.id = id;
		} else {

		}
	};
}

module.exports = ProfilePost;