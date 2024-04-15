export interface Author {
	username: string;
	image: string | null;
}

export interface Group {
	name: string;
	logo: string | null;
}

export interface Post {
	author: Author;
	createdAt: string;
	groupId: string;
	group: Group;
	id: string;
	title: string;
	content: string;
	_count: { comments: number };
	comments: Comment[];
	media: string[];
}

export interface Comment {
	id: string;
	author: Author;
}
