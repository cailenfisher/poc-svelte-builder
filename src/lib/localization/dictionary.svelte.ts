import { PUBLIC_APPLICATION_DEFAULT_LANGUAGE } from '$env/static/public';

import type { LocalText } from './localization';

let dictionary = $state();

export const loadDictionary = async (data: LocalText[]) => {
	if (!data) {
		console.error('loadDictionary called without data.');
		return;
	}
	const flattened = flattenDictionary(data);
	dictionary = flattened;
	console.log('loadDictionary done', dictionary);
};

function flattenDictionary(
	payload: LocalText[],
	defaultLang: string = PUBLIC_APPLICATION_DEFAULT_LANGUAGE,
	preferredLang: string = PUBLIC_APPLICATION_DEFAULT_LANGUAGE
): LocalText[] {
	const grouped = payload.reduce<Record<string, Record<string, LocalText>>>((acc, item) => {
		const slug = item.link.slug;
		if (!acc[slug]) acc[slug] = {};
		acc[slug][item.locale.code] = item;
		return acc;
	}, {});

	return Object.values(grouped).map((localeEntries) => {
		return (
			localeEntries[preferredLang] ?? localeEntries[defaultLang] ?? Object.values(localeEntries)[0]
		);
	});
}
