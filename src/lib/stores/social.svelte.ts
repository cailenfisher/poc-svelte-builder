import type { SocialUser, SocialPost, SocialComment } from '$lib/types/social';

export const socialUsers: SocialUser[] = [
	{
		id: 'u1',
		name: 'Alex Chen',
		handle: 'alex_dev',
		avatarColor: 'bg-blue-600',
		bio: 'Full-stack engineer building cool things. Svelte enthusiast.',
		followersCount: 842,
		followingCount: 210,
	},
	{
		id: 'u2',
		name: 'Jane Park',
		handle: 'jane_design',
		avatarColor: 'bg-purple-600',
		bio: 'UI/UX designer crafting delightful experiences.',
		followersCount: 1203,
		followingCount: 388,
	},
	{
		id: 'u3',
		name: 'Mike Torres',
		handle: 'mike_pm',
		avatarColor: 'bg-green-600',
		bio: 'Product manager at a fast-moving startup.',
		followersCount: 567,
		followingCount: 142,
	},
	{
		id: 'u4',
		name: 'Sarah Kim',
		handle: 'sarah_eng',
		avatarColor: 'bg-orange-500',
		bio: 'Backend engineer obsessed with distributed systems.',
		followersCount: 934,
		followingCount: 275,
	},
	{
		id: 'u5',
		name: 'Tom Davis',
		handle: 'tom_data',
		avatarColor: 'bg-teal-600',
		bio: 'Data scientist turning numbers into insights.',
		followersCount: 421,
		followingCount: 180,
	},
];

export const socialUserMap = new Map<string, SocialUser>(socialUsers.map((u) => [u.id, u]));

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString();
const minutesAgo = (m: number) => new Date(now - m * 60_000).toISOString();

const seedPosts: SocialPost[] = [
	{
		id: 'p1',
		authorId: 'u2',
		content:
			"Just shipped a major redesign of our onboarding flow. The key insight: reduce friction at every step. We cut the time-to-first-value by 40%! A/B testing is your best friend. 🚀",
		createdAt: minutesAgo(12),
		likedBy: ['u1', 'u3', 'u4'],
	},
	{
		id: 'p2',
		authorId: 'u1',
		content:
			"Hot take: the best code is the code you don't write. Spent the afternoon deleting 800 lines and the app is faster, simpler, and more maintainable. Deletion-driven development is underrated.",
		createdAt: minutesAgo(47),
		likedBy: ['u2', 'u5'],
	},
	{
		id: 'p3',
		authorId: 'u4',
		content:
			"Kubernetes networking finally clicked for me today after 6 months. The moment things go from \"magic\" to \"oh, it's just NAT + iptables rules\" is incredibly satisfying.",
		createdAt: hoursAgo(2),
		likedBy: ['u1', 'u2', 'u3', 'u5'],
	},
	{
		id: 'p4',
		authorId: 'u3',
		content:
			"Hot tip for product managers: before adding a feature, ask \"what problem does this solve for which users?\" If you can't answer that clearly, the feature probably shouldn't exist yet.",
		createdAt: hoursAgo(4),
		likedBy: ['u2', 'u4'],
	},
	{
		id: 'p5',
		authorId: 'u1',
		content:
			"Been exploring SvelteKit for a new project and wow — the developer experience is exceptional. Routing, SSR, stores, and component model all feel cohesive. Why aren't more people talking about this?",
		createdAt: hoursAgo(6),
		likedBy: ['u2', 'u3', 'u4', 'u5'],
	},
	{
		id: 'p6',
		authorId: 'u5',
		content:
			"Reminder that correlation ≠ causation. Just saw a dashboard that \"proved\" ice cream sales cause drowning deaths. Always dig into the confounding variables before drawing conclusions.",
		createdAt: hoursAgo(9),
		likedBy: ['u1', 'u3'],
	},
	{
		id: 'p7',
		authorId: 'u2',
		content:
			"Typography tip: your body text line-height should be around 1.5–1.6 for readability. Most default browser styles use 1.2 which is fine for headings but exhausting for long-form reading.",
		createdAt: hoursAgo(14),
		likedBy: ['u1', 'u4', 'u5'],
	},
	{
		id: 'p8',
		authorId: 'u4',
		content:
			"PostgreSQL's EXPLAIN ANALYZE is one of the most powerful tools I use. Spent 10 minutes with it today and found a query doing a full table scan instead of hitting the index. Fixed in 2 minutes.",
		createdAt: hoursAgo(20),
		likedBy: ['u1', 'u2', 'u5'],
	},
];

const seedComments: SocialComment[] = [
	{
		id: 'c1',
		postId: 'p1',
		authorId: 'u1',
		content: 'Would love to see the before/after flow! Which friction points were the biggest wins?',
		createdAt: minutesAgo(8),
	},
	{
		id: 'c2',
		postId: 'p1',
		authorId: 'u3',
		content: 'Onboarding is so underinvested. Most teams focus on acquisition but forget retention starts at day one.',
		createdAt: minutesAgo(5),
	},
	{
		id: 'c3',
		postId: 'p2',
		authorId: 'u4',
		content: 'Agreed! The best refactor I ever did was replacing 500 lines of custom auth with a 5-line library call.',
		createdAt: minutesAgo(40),
	},
	{
		id: 'c4',
		postId: 'p2',
		authorId: 'u2',
		content: '"Deletion-driven development" — I\'m stealing this phrase.',
		createdAt: minutesAgo(35),
	},
	{
		id: 'c5',
		postId: 'p3',
		authorId: 'u1',
		content: 'The iptables mental model really does unlock everything. Once you get it, CNI plugins aren\'t scary anymore.',
		createdAt: hoursAgo(1),
	},
	{
		id: 'c6',
		postId: 'p5',
		authorId: 'u3',
		content: 'SvelteKit\'s file-based routing + server load functions is genuinely elegant. The $lib alias alone saves so much headache.',
		createdAt: hoursAgo(5),
	},
	{
		id: 'c7',
		postId: 'p5',
		authorId: 'u4',
		content: 'The reactivity model in Svelte 5 (runes) is worth learning for the mental model alone.',
		createdAt: hoursAgo(4),
	},
	{
		id: 'c8',
		postId: 'p6',
		authorId: 'u2',
		content: "Classic spurious correlation! Simpson's paradox is another great one to keep in mind.",
		createdAt: hoursAgo(8),
	},
	{
		id: 'c9',
		postId: 'p8',
		authorId: 'u5',
		content: 'EXPLAIN ANALYZE + auto_explain + pgBadger = a complete query performance investigation toolkit.',
		createdAt: hoursAgo(18),
	},
];

export let posts = $state<SocialPost[]>(seedPosts);
export let comments = $state<SocialComment[]>(seedComments);
export let followingIds = $state<string[]>(['u2', 'u4']);

export function addPost(content: string, authorId: string): string {
	const id = `p${Date.now()}`;
	posts.unshift({ id, authorId, content, createdAt: new Date().toISOString(), likedBy: [] });
	return id;
}

export function updatePost(id: string, content: string) {
	const post = posts.find((p) => p.id === id);
	if (post) post.content = content;
}

export function removePost(id: string) {
	const idx = posts.findIndex((p) => p.id === id);
	if (idx !== -1) posts.splice(idx, 1);
	for (let i = comments.length - 1; i >= 0; i--) {
		if (comments[i].postId === id) comments.splice(i, 1);
	}
}

export function toggleLike(postId: string, userId: string) {
	const post = posts.find((p) => p.id === postId);
	if (!post) return;
	const idx = post.likedBy.indexOf(userId);
	if (idx === -1) {
		post.likedBy.push(userId);
	} else {
		post.likedBy.splice(idx, 1);
	}
}

export function addComment(postId: string, content: string, authorId: string): string {
	const id = `c${Date.now()}`;
	comments.push({ id, postId, authorId, content, createdAt: new Date().toISOString() });
	return id;
}

export function removeComment(id: string) {
	const idx = comments.findIndex((c) => c.id === id);
	if (idx !== -1) comments.splice(idx, 1);
}

export function toggleFollow(userId: string) {
	const idx = followingIds.indexOf(userId);
	if (idx === -1) {
		followingIds.push(userId);
	} else {
		followingIds.splice(idx, 1);
	}
}
