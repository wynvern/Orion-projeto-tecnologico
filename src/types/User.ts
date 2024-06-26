export default interface User {
	username: string;
	name: string;
	image: string;
	id: string;
	bio: string;
	banner: string;
	_count: {
		posts: number;
		bookmarks: number;
		groups: number;
	};
}
