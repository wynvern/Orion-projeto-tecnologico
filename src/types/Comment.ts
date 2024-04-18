export default interface Comment {
	id: string;
	text: string;
	medias: string[];
	childComments: Comment[];
}
