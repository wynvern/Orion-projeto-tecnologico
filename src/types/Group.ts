export interface Group {
	banner?: string;
	image?: string;
	ownerId: string;
	name: string;
	groupName: string;
	id: string;
	description: string;
	_count: {
		posts: number;
		members: number;
		groupViews: number;
	};
	categories: string[];
}
