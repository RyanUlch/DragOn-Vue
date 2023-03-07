<!-- DropElement is a state-agnostic element -->
<script setup lang="ts">
	// Vue Imports:
	import { onMounted, onBeforeUnmount } from 'vue';
	import {
		registerDropComponents,
		deregisterDropComponents,
		setHoveredDropOnComponent,
	} from '../helpers/dragOnHelpers';
	import type { dragOnType, dragOnTypes, dropOnId } from '../helpers/dragOnHelpers';

	// Props
	const props = withDefaults(
		defineProps<{
			dragOnType: dragOnType | dragOnTypes;
			dropOnId: dropOnId;
		}>(),
		{ dragOnType: 'default' },
	);

	// Lifecycle Hooks:
	// When mounted, it runs a callback to register it with registerDropElement
	onMounted(() => registerDropComponents(props.dragOnType, props.dropOnId));
	// Deregister element if it gets unmounted for some reason
	onBeforeUnmount(() => deregisterDropComponents(props.dragOnType, props.dropOnId));
</script>

<template>
	<div
		@mouseenter="() => setHoveredDropOnComponent(props)"
		@touchenter="() => setHoveredDropOnComponent(props)"
		@mouseleave="() => setHoveredDropOnComponent(null)"
		@touchleave="() => setHoveredDropOnComponent(null)">
		<slot></slot>
	</div>
</template>
