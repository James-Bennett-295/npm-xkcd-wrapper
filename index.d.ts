interface Post {
	link: string,
	num: number,
	title: string,
	safeTitle: string,
	date: Date,
	alt: string,
	imgUrl: string
}

export function getLatest(): Post;

export function getPost(
	postNum: number
): Post;

export function getRandom(): Post;

export function subscribe(
	newPostCheckIntervalInSeconds?: number,
	dataFilePath?: string
): void;

export function msg(
	msg: string,
	obj: Post
): text;

export const events: object;
