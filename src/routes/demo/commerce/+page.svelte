<script lang="ts">
	import type { Product } from '$lib/types/commerce';
	import { products, categories } from '$lib/stores/commerce.svelte';
	import LocalText from '$lib/localization/LocalText.svelte';
	import CategoryFilter from '$lib/components/commerce/CategoryFilter.svelte';
	import ProductCard from '$lib/components/commerce/ProductCard.svelte';
	import ProductGrid from '$lib/components/commerce/ProductGrid.svelte';
	import ProductModal from '$lib/components/commerce/ProductModal.svelte';

	let selectedCategory = $state<string | null>(null);
	let selectedProduct = $state<Product | null>(null);
	let modalOpen = $state(false);

	const visibleProducts = $derived.by(() => {
		const published = products.filter((p) => p.isPublished);
		if (!selectedCategory) return published;
		return published.filter((p) => p.categoryId === selectedCategory);
	});

	const featuredProducts = $derived(
		products.filter((p) => p.isPublished && p.isFeatured && !selectedCategory)
	);

	function openProduct(product: Product) {
		selectedProduct = product;
		modalOpen = true;
	}

	function closeModal() {
		modalOpen = false;
		selectedProduct = null;
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
	<div class="mb-8 flex items-start justify-between">
		<div>
			<h1 class="page-title"><LocalText slug="commerce_page_title" /></h1>
			<p class="page-subtitle mt-1"><LocalText slug="commerce_page_subtitle" /></p>
		</div>
		<a href="/demo/commerce/admin" class="btn btn-secondary btn-sm">
			<LocalText slug="commerce_admin_link" />
		</a>
	</div>

	{#if featuredProducts.length > 0}
		<section class="mb-10">
			<h2 class="section-title mb-4"><LocalText slug="commerce_featured_heading" /></h2>
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
				{#each featuredProducts as product (product.id)}
					<ProductCard {product} onclick={openProduct} />
				{/each}
			</div>
		</section>
		<hr class="mb-8 border-gray-100" />
	{/if}

	<section>
		<div class="mb-5 flex items-center justify-between">
			<h2 class="section-title"><LocalText slug="commerce_all_products_heading" /></h2>
			<p class="text-sm text-gray-400">
				{visibleProducts.length}
				<LocalText slug="commerce_products_count_label" />
			</p>
		</div>

		<div class="mb-6">
			<CategoryFilter
				{categories}
				selected={selectedCategory}
				onselect={(id) => (selectedCategory = id)}
			/>
		</div>

		<ProductGrid products={visibleProducts} onselect={openProduct} />
	</section>
</div>

<ProductModal product={selectedProduct} open={modalOpen} onclose={closeModal} />
