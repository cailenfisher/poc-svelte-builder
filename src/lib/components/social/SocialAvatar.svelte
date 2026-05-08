<script lang="ts">
	let {
		name,
		color = 'bg-gray-500',
		size = 'md',
	}: {
		name: string;
		color?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	} = $props();

	const initials = $derived(
		name
			.split(' ')
			.map((n) => n[0])
			.slice(0, 2)
			.join('')
			.toUpperCase()
	);

	const sizeClass = $derived(`social-avatar-${size}`);
</script>

<div class="social-avatar {sizeClass} {color}" title={name} aria-label={name}>
	{initials}
</div>
