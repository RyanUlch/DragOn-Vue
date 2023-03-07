<script setup lang="ts">
	import DropOn from './components/DropOn.vue';
</script>

<template>
	<div>
		<DropOn
			class="container"
			dropOnId="1">
			<p>I'm a "DropOn" Element</p>
		</DropOn>
	</div>
</template>

<style scoped>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200px;
		width: 300px;
		background-color: hsl(200, 50%, 50%);
		border-radius: 1rem;
		border: 1px solid hsl(200, 10%, 10%);
	}
</style>
