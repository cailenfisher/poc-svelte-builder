export type SocialUser = {
	id: string;
	name: string;
	handle: string;
	avatarColor: string;
	bio: string;
	followersCount: number;
	followingCount: number;
};

export type SocialPost = {
	id: string;
	authorId: string;
	content: string;
	createdAt: string;
	likedBy: string[];
};

export type SocialComment = {
	id: string;
	postId: string;
	authorId: string;
	content: string;
	createdAt: string;
};
