interface Post {
	link: string,
	num: number,
	title: string,
	safeTitle: string,
	date: Date,
	alt: string,
	imgUrl: string
}

export function getLatest(): Promise<Post>;

export function getPost(
	postNum: number
): Promise<Post>;

export function getRandom(): Promise<Post>;

export function subscribe(
	newPostCheckIntervalInSeconds?: number,
	dataFilePath?: string
): void;

export function msg(
	msg: string,
	obj: Post
): text;

export const events: object;
