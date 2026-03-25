import { PUBLIC_APPLICATION_DEFAULT_LANGUAGE } from '$env/static/public';

import type { LocalText } from './localization';

let dictionary: LocalText[] | undefined = $state();

export function getContentBySlug(slug: string): LocalText | undefined {
	if (!dictionary) {
		console.error('getContentBySlug called with no dictionary defined');
		return;
	}
	return dictionary.find((item) => item.link.slug === slug);
}

export const loadDictionary = (data: LocalText[], flattened: boolean = false): boolean => {
	if (!data) {
		console.error('loadDictionary called without data.');
		return false;
	}
	if (flattened) {
		// trust but verify
		// todo: find optimized approach to this check
		const seen = new Set<string>();
		for (const item of data) {
			const key = `${item.link.id}|${item.scoped_content_id ?? 'null'}`;

			if (seen.has(key)) {
				flattened = false;
				console.warn('loadDictionary called with flattened data, but a collision was found.', key);
				break;
			}

			seen.add(key);
		}
	}
	dictionary = flattened ? data : flattenDictionary(data);
	return true;
};

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
