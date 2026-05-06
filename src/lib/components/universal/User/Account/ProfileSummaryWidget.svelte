<script lang="ts">
	import Avatar from './Auth/Avatar.svelte';

	let { session } = $props();
	let { user } = $derived(session);
</script>

<div class="p-1">
	<Avatar {user} />
</div>
