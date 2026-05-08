<script lang="ts">
	import type { Product } from '$lib/types/commerce';
	import { products, addProduct, updateProduct, removeProduct } from '$lib/stores/commerce.svelte';
	import LocalText from '$lib/localization/LocalText.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import AdminProductTable from '$lib/components/commerce/AdminProductTable.svelte';
	import ProductForm from '$lib/components/commerce/ProductForm.svelte';

	type FormMode = 'add' | 'edit';

	let formOpen = $state(false);
	let formMode = $state<FormMode>('add');
	let editingProduct = $state<Product | null>(null);

	let deleteTarget = $state<Product | null>(null);
	let confirmOpen = $state(false);

	const totalProducts = $derived(products.length);
	const publishedCount = $derived(products.filter((p) => p.isPublished).length);
	const outOfStockCount = $derived(products.filter((p) => p.stock === 0).length);

	function openAdd() {
		editingProduct = null;
		formMode = 'add';
		formOpen = true;
	}

	function openEdit(product: Product) {
		editingProduct = product;
		formMode = 'edit';
		formOpen = true;
	}

	function closeForm() {
		formOpen = false;
		editingProduct = null;
	}

	function handleFormSubmit(data: Omit<Product, 'id'>) {
		if (formMode === 'edit' && editingProduct) {
			updateProduct(editingProduct.id, data);
		} else {
			addProduct(data);
		}
		closeForm();
	}

	function openDeleteConfirm(product: Product) {
		deleteTarget = product;
		confirmOpen = true;
	}

	function confirmDelete() {
		if (deleteTarget) removeProduct(deleteTarget.id);
		deleteTarget = null;
		confirmOpen = false;
	}

	function cancelDelete() {
		deleteTarget = null;
		confirmOpen = false;
	}
</script>

<div class="commerce-admin-shell">
	<header class="commerce-admin-header">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<a href="/demo/commerce" class="back-link">
					<LocalText slug="commerce_back_to_store" />
				</a>
				<span class="text-gray-300">|</span>
				<div>
					<h1 class="page-title"><LocalText slug="commerce_admin_title" /></h1>
					<p class="page-subtitle"><LocalText slug="commerce_admin_subtitle" /></p>
				</div>
			</div>
			<button type="button" class="btn btn-primary btn-sm" onclick={openAdd}>
				+ <LocalText slug="commerce_admin_add_product" />
			</button>
		</div>
	</header>

	<div class="commerce-admin-body max-w-7xl">
		<!-- Stats row -->
		<div class="mb-6 grid grid-cols-3 gap-4">
			<div class="card p-5">
				<p class="stat-label"><LocalText slug="commerce_stat_total" /></p>
				<p class="stat-number">{totalProducts}</p>
			</div>
			<div class="card p-5">
				<p class="stat-label"><LocalText slug="commerce_stat_published" /></p>
				<p class="stat-number">{publishedCount}</p>
			</div>
			<div class="card p-5">
				<p class="stat-label"><LocalText slug="commerce_stat_out_of_stock" /></p>
				<p class="stat-number {outOfStockCount > 0 ? 'text-red-600' : ''}">{outOfStockCount}</p>
			</div>
		</div>

		<!-- Product table -->
		<div class="card p-6">
			<AdminProductTable {products} onedit={openEdit} ondelete={openDeleteConfirm} />
		</div>
	</div>
</div>

<!-- Add / Edit modal -->
<Modal open={formOpen} size="lg" onclose={closeForm}>
	{#snippet header()}
		<span class="modal-title">
			{#if formMode === 'edit'}
				<LocalText slug="commerce_admin_edit_product" />
			{:else}
				<LocalText slug="commerce_admin_new_product" />
			{/if}
		</span>
	{/snippet}
	<ProductForm
		product={editingProduct ?? undefined}
		onsubmit={handleFormSubmit}
		oncancel={closeForm}
	/>
</Modal>

<!-- Delete confirmation modal -->
<Modal open={confirmOpen} size="sm" onclose={cancelDelete}>
	{#snippet header()}
		<span class="modal-title"><LocalText slug="commerce_admin_confirm_delete_title" /></span>
	{/snippet}
	<p class="text-sm text-gray-600">
		<LocalText slug="commerce_admin_confirm_delete_body" />
	</p>
	{#if deleteTarget}
		<p class="mt-2 font-medium text-gray-900">{deleteTarget.name}</p>
	{/if}
	{#snippet footer()}
		<button type="button" class="btn btn-secondary btn-sm" onclick={cancelDelete}>
			<LocalText slug="commerce_admin_cancel" />
		</button>
		<button type="button" class="btn btn-danger btn-sm" onclick={confirmDelete}>
			<LocalText slug="commerce_admin_delete" />
		</button>
	{/snippet}
</Modal>
