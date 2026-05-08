import type { Product, ProductCategory } from '$lib/types/commerce';

export const categories: ProductCategory[] = [
	{ id: 'electronics', name: 'Electronics' },
	{ id: 'clothing', name: 'Clothing' },
	{ id: 'books', name: 'Books' },
	{ id: 'kitchen', name: 'Kitchen' },
];

export const categoryMeta: Record<string, { bg: string; emoji: string }> = {
	electronics: { bg: 'bg-blue-100', emoji: '⚡' },
	clothing: { bg: 'bg-purple-100', emoji: '🧥' },
	books: { bg: 'bg-amber-100', emoji: '📚' },
	kitchen: { bg: 'bg-orange-100', emoji: '🍳' },
};

const seedProducts: Product[] = [
	{
		id: '1',
		name: 'Nexus Pro 15 Laptop',
		description:
			'A powerhouse laptop featuring a 15" OLED display, 32GB RAM, dedicated GPU, and all-day battery life in a slim 1.6kg chassis.',
		price: 1299,
		categoryId: 'electronics',
		stock: 8,
		isPublished: true,
		isFeatured: true,
	},
	{
		id: '2',
		name: 'UltraWave Pro Headphones',
		description:
			'Studio-grade over-ear headphones with active noise cancellation, 40-hour battery, and lossless wireless audio.',
		price: 199,
		categoryId: 'electronics',
		stock: 24,
		isPublished: true,
		isFeatured: true,
	},
	{
		id: '3',
		name: 'Helios SmartWatch',
		description:
			'Health-focused smartwatch with ECG monitoring, sleep tracking, GPS, and a stunning always-on AMOLED display.',
		price: 349,
		categoryId: 'electronics',
		stock: 12,
		isPublished: true,
		isFeatured: false,
	},
	{
		id: '4',
		name: 'MagCharge Wireless Pad',
		description:
			'15W magnetic wireless charging pad compatible with all Qi devices. Includes a smart LED indicator and anti-slip base.',
		price: 49,
		categoryId: 'electronics',
		stock: 0,
		isPublished: true,
		isFeatured: false,
	},
	{
		id: '5',
		name: 'SmartHub Connect',
		description:
			'Centralize your smart home devices with this hub supporting Zigbee, Z-Wave, and Matter protocols. Voice assistant compatible.',
		price: 99,
		categoryId: 'electronics',
		stock: 30,
		isPublished: true,
		isFeatured: false,
	},
	{
		id: '6',
		name: 'Alpine Trek Jacket',
		description:
			'Waterproof, windproof 3-in-1 jacket with removable fleece liner. Ideal for urban commuting or mountain trails.',
		price: 139,
		categoryId: 'clothing',
		stock: 18,
		isPublished: true,
		isFeatured: true,
	},
	{
		id: '7',
		name: 'Essential Tee 3-Pack',
		description:
			'Premium ring-spun cotton crew-neck tees in three neutral colors. Pre-shrunk, tagless, and built to last.',
		price: 39,
		categoryId: 'clothing',
		stock: 55,
		isPublished: true,
		isFeatured: false,
	},
	{
		id: '8',
		name: 'Slim Chino Trousers',
		description:
			'Stretch-twill slim-fit chinos in a versatile mid-grey. Wrinkle-resistant for all-day comfort from desk to dinner.',
		price: 79,
		categoryId: 'clothing',
		stock: 22,
		isPublished: true,
		isFeatured: false,
	},
	{
		id: '9',
		name: 'Zero to One: Building Tomorrow',
		description:
			'A practical guide to startup thinking and breakthrough innovation from the early days of the tech revolution.',
		price: 24,
		categoryId: 'books',
		stock: 40,
		isPublished: true,
		isFeatured: false,
	},
	{
		id: '10',
		name: 'Clean Code: The Pragmatic Way',
		description:
			'Master the art of writing readable, maintainable software with real-world examples and battle-tested principles.',
		price: 42,
		categoryId: 'books',
		stock: 35,
		isPublished: true,
		isFeatured: false,
	},
	{
		id: '11',
		name: 'Design Systems Illustrated',
		description:
			'A visual-first deep dive into building scalable design systems, component libraries, and living style guides.',
		price: 38,
		categoryId: 'books',
		stock: 0,
		isPublished: true,
		isFeatured: false,
	},
	{
		id: '12',
		name: 'The Rust Programming Language',
		description:
			'The official, comprehensive guide to Rust from the core team. Covers ownership, lifetimes, concurrency, and the full standard library.',
		price: 45,
		categoryId: 'books',
		stock: 28,
		isPublished: true,
		isFeatured: false,
	},
	{
		id: '13',
		name: 'Heritage Cast Iron Set',
		description:
			'Pre-seasoned 3-piece cast iron set (8", 10", 12") with helper handles. Compatible with all cooktops including induction.',
		price: 99,
		categoryId: 'kitchen',
		stock: 14,
		isPublished: true,
		isFeatured: true,
	},
	{
		id: '14',
		name: 'Barista Pro Espresso Machine',
		description:
			'15-bar pressure semi-automatic espresso machine with a built-in grinder, steam wand, and programmable shot timer.',
		price: 329,
		categoryId: 'kitchen',
		stock: 6,
		isPublished: true,
		isFeatured: false,
	},
	{
		id: '15',
		name: 'Artisan Cutting Board Set',
		description:
			'Set of three end-grain bamboo cutting boards in graduated sizes. Juice grooves, non-slip feet, and naturally antimicrobial.',
		price: 65,
		categoryId: 'kitchen',
		stock: 20,
		isPublished: true,
		isFeatured: false,
	},
];

export let products = $state<Product[]>(seedProducts);

export function addProduct(product: Omit<Product, 'id'>): string {
	const id = String(Date.now());
	products.push({ ...product, id });
	return id;
}

export function updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>) {
	const idx = products.findIndex((p) => p.id === id);
	if (idx !== -1) Object.assign(products[idx], updates);
}

export function removeProduct(id: string) {
	const idx = products.findIndex((p) => p.id === id);
	if (idx !== -1) products.splice(idx, 1);
}

export function getCategoryName(categoryId: string): string {
	return categories.find((c) => c.id === categoryId)?.name ?? categoryId;
}
