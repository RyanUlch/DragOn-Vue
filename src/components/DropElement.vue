<!-- DropElement is a state-agnostic element -->
<script setup lang="ts">
	// Vue Imports:
	import { onMounted, onBeforeUnmount } from 'vue';
	import {
		registerDropElement,
		deregisterDropElement,
		updateHoverHandler,
	} from '../helpers/dropHelpers';

	// Props
	const props = defineProps<{
		dropElementIndex: number;
		dragElementType: string;
	}>();

	// Lifecycle Hooks:
	// When mounted, it runs a callback to register it with registerDropElement
	onMounted(() => {
		registerDropElement(props.dragElementType, props.dropElementIndex);
	});
	// Deregister element if it gets unmounted for some reason
	onBeforeUnmount(() => {
		deregisterDropElement(props.dragElementType, props.dropElementIndex);
	});
</script>

<template>
	<div
		@mouseenter="
			() => {
				updateHoverHandler(props.dropElementIndex, props.dragElementType);
			}
		"
		@mouseleave="
			() => {
				updateHoverHandler();
			}
		"
		@touchenter="
			() => {
				updateHoverHandler(props.dropElementIndex, props.dragElementType);
			}
		"
		@touchleave="
			() => {
				updateHoverHandler();
			}
		">
		<slot></slot>
	</div>
</template>
