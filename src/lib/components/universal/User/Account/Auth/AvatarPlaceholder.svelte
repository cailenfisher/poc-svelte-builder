<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { faUser } from '@fortawesome/free-solid-svg-icons';
</script>

<div class="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
	<div class="absolute inset-0 flex items-center justify-center text-gray-400">
		<Icon icon={faUser} class="h-6 w-6" />
	</div>
</div>
