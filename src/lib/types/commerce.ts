export type ProductCategory = {
	id: string;
	name: string;
};

export type Product = {
	id: string;
	name: string;
	description: string;
	price: number;
	categoryId: string;
	stock: number;
	isPublished: boolean;
	isFeatured: boolean;
};
