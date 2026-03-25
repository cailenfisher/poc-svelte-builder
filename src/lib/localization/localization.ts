export type LocalTextLink = {
	id: number;
	slug: string;
	title: string;
	scope: string | null;
};

export type Locale = {
	id: number;
	code: string;
	title: string;
	native_title: string;
	dir: 'ltr' | 'rtl' | 'auto';
};

export type LocalText = {
	id: number;
	scoped_content_id: number | null;
	content: string;
	locale: Locale;
	link: LocalTextLink;
};
