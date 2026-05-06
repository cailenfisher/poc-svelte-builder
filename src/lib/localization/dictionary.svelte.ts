import { PUBLIC_APPLICATION_DEFAULT_LANGUAGE } from '$env/static/public';
import IntlMessageFormat from 'intl-messageformat';
import type { LocalText } from './localization';

let dictionary: LocalText[] | undefined = $state();

// Cache compiled MessageFormat instances keyed by "content\x00localeCode"
const mfCache = new Map<string, IntlMessageFormat>();

function getCompiledMF(content: string, localeCode: string): IntlMessageFormat {
	const key = `${content}\x00${localeCode}`;
	let mf = mfCache.get(key);
	if (!mf) {
		mf = new IntlMessageFormat(content, localeCode);
		mfCache.set(key, mf);
	}
	return mf;
}

export function getContent(
	slug: string,
	scope?: string | null,
	contentId?: number | null
): LocalText | undefined {
	if (!dictionary) {
		console.error('getContent called with no dictionary defined');
		return undefined;
	}
	return dictionary.find((item) => {
		if (item.link.slug !== slug) return false;
		if (scope !== undefined && scope !== null && item.link.scope !== scope) return false;
		if (contentId !== undefined && contentId !== null && item.scoped_content_id !== contentId)
			return false;
		return true;
	});
}

// Backward-compatible alias — existing callers need no changes
export function getContentBySlug(slug: string): LocalText | undefined {
	return getContent(slug);
}

// Inline API for use outside Svelte components.
// Returns the slug itself when content is missing so gaps are visible in development.
export function localText(
	slug: string,
	values?: Record<string, unknown>,
	scope?: string | null,
	contentId?: number | null
): string {
	const item = getContent(slug, scope, contentId);
	if (!item) return slug;
	if (!values) return item.content;
	try {
		return String(getCompiledMF(item.content, item.locale.code).format(values));
	} catch (e) {
		console.error(`localText: ICU format error for slug "${slug}"`, e);
		return item.content;
	}
}

export const loadDictionary = (data: LocalText[], flattened: boolean = false): boolean => {
	if (!data) {
		console.error('loadDictionary called without data.');
		return false;
	}
	mfCache.clear();
	dictionary = flattened ? verifiedFlat(data) : flattenDictionary(data);
	return dictionary !== undefined;
};

// Additive load for scope-partitioned content fetched at the page level.
// Deduplicates by link.id + scoped_content_id; safe to call multiple times.
export const mergeDictionary = (data: LocalText[], flattened: boolean = false): boolean => {
	if (!data) {
		console.error('mergeDictionary called without data.');
		return false;
	}
	const incoming = flattened ? verifiedFlat(data) : flattenDictionary(data);
	if (!incoming) return false;
	if (!dictionary) {
		dictionary = incoming;
		return true;
	}
	const existingKeys = new Set(
		dictionary.map((item) => `${item.link.id}|${item.scoped_content_id ?? 'null'}`)
	);
	const newEntries = incoming.filter(
		(item) => !existingKeys.has(`${item.link.id}|${item.scoped_content_id ?? 'null'}`)
	);
	if (newEntries.length > 0) dictionary = [...dictionary, ...newEntries];
	return true;
};

function verifiedFlat(data: LocalText[]): LocalText[] | undefined {
	const seen = new Set<string>();
	for (const item of data) {
		const key = `${item.link.id}|${item.scoped_content_id ?? 'null'}`;
		if (seen.has(key)) {
			console.warn('verifiedFlat: collision found, re-flattening.', key);
			return flattenDictionary(data);
		}
		seen.add(key);
	}
	return data;
}

function flattenDictionary(
	payload: LocalText[],
	defaultLanguage: string = PUBLIC_APPLICATION_DEFAULT_LANGUAGE,
	preferredLanguage: string = PUBLIC_APPLICATION_DEFAULT_LANGUAGE
): LocalText[] | undefined {
	if (!payload || payload.length < 1) {
		console.error('flattenDictionary called with no data.');
		return undefined;
	}
	const grouped = payload.reduce<Record<string, Record<string, LocalText>>>((results, item) => {
		const key = `${item.link.id}|${item.scoped_content_id ?? 'null'}`;
		if (!results[key]) results[key] = {};
		results[key][item.locale.code] = item;
		return results;
	}, {});
	return Object.values(grouped).map((localeEntries) => {
		return (
			localeEntries[preferredLanguage] ??
			localeEntries[defaultLanguage] ??
			Object.values(localeEntries)[0]
		);
	});
}
