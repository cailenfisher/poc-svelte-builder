export type ApplicationUser = {
	email: string;
	displayName?: string;
	avatarUrl?: string;
};

export let activeUser = $state<ApplicationUser | undefined>(undefined);