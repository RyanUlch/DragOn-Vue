<!-- DragOn is an encapsulated-state element -->
<script setup lang="ts">
	/* eslint-disable no-mixed-spaces-and-tabs */

	// Vue Imports:
	import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
	// Drag Store Import:
	import { isOverValidDropOnComponent, getEligibleDropId } from '../helpers/dragOnHelpers';

	// Props: NOTE: All props are optional - Some props if provided, require other props
	const props = withDefaults(
		defineProps<{
			// If any below used; all are required: - These allow DragOn to be dropped into specific DropElements
			dragInfo?: {
				dragType: number | string;
				dragId: number;
				dropId: number;
				dropHandler: (
					dropType: number | string,
					dragId: number,
					droppedIntoId: number | string,
					droppedFromId: number | string,
				) => void;
			};
			// Optional - Can be used regardless of if the above props are supplied
			offset?: [string, string];
			bounds?: {
				top?: number;
				right?: number;
				bottom?: number;
				left?: number;
			};
			preventX?: boolean;
			preventY?: boolean;
			hoverClass?: string;
			canBeDropped?: (dragType: number | string, dragId: number | string) => boolean;
			disabled?: boolean;
		}>(),
		{
			disabled: false,
		},
	);

	// Lifecycle Hooks:

	// When mounted, move card to the top left of the parent container
	// props.startingOffset used to space elements manually from initialization
	onMounted(() => {
		dragCurrentLocation.value = [
			props.offset ? props.offset[0] : '0px',
			props.offset ? props.offset[1] : '0px',
		];
	});

	// Clear any outstanding interval/timers/listeners before unmounting
	onBeforeUnmount(() => {
		cleanupSideEffects();
	});

	// State:
	const dragCurrentLocation = ref<[string, string]>(['0px', '0px']);
	const dragStartingLocation = ref<[string, string]>(['0px', '0px']);
	const DragOnReference = ref<HTMLDivElement>(); // Reference to DragOn to get
	const isCurrentlyDragged = ref<boolean>(false);

	// Update and prevent pointer events if user is currently dragging this element
	const styleObject = reactive({
		PointerEvent: isCurrentlyDragged.value ? 'none' : 'auto',
	});

	// Methods:
	const cleanupSideEffects = () => {
		document.removeEventListener('mouseup', dragStopHandler);
		document.removeEventListener('mousemove', mouseHandle);
		document.removeEventListener('touchend', dragStopHandler);
		document.removeEventListener('touchmove', touchHandle);
		isValidHovering.value = false;
	};

	// If the user provided bounds, check bounds against mouse position in 4 directions.
	// Any position is allowed to be undefined, as constraints can be made in any combination of directions.
	const checkBounds = (vertical: number, horizontal: number): [string, string] => {
		if (props.bounds) {
			return [
				props.preventY
					? dragCurrentLocation.value[0]
					: (props.bounds.top === undefined || props.bounds.top < vertical) &&
					  (props.bounds.bottom === undefined || vertical < props.bounds.bottom)
					? `${vertical}px`
					: dragCurrentLocation.value[0],
				props.preventX
					? dragCurrentLocation.value[1]
					: (props.bounds.left === undefined || props.bounds.left < horizontal) &&
					  (props.bounds.right === undefined || horizontal < props.bounds.right)
					? `${horizontal}px`
					: dragCurrentLocation.value[1],
			];
		} else {
			return [`${vertical}px`, `${horizontal}px`];
		}
	};

	// Listener Handlers:

	const mouseHandle = (event: MouseEvent) => {
		dragHandler(event.clientY, event.clientX);
	};
	const touchHandle = (event: TouchEvent) => {
		dragHandler(event.touches[0].clientY, event.touches[0].clientX);
	};

	// When user clicks and holds onto a DragOn, kick off listeners to handle everything else
	const mouseDragStartHandler = (event: MouseEvent) => {
		if (props.disabled === false) {
			// Capture current location in case drop is unsuccessful
			dragStartingLocation.value = [...dragCurrentLocation.value];
			dragHandler(event.clientY, event.clientX);

			// Attach listeners to window to monitor movement/dropping
			document.addEventListener('mousemove', mouseHandle);
			document.addEventListener('mouseup', dragStopHandler);
		}
	};
	const touchDragStartHandler = (event: TouchEvent) => {
		// Capture current location in case drop is unsuccessful
		dragStartingLocation.value = [...dragCurrentLocation.value];
		dragHandler(event.touches[0].clientY, event.touches[0].clientX);

		// Attach listeners to window to monitor movement/dropping
		document.addEventListener('touchmove', touchHandle);
		document.addEventListener('touchend', dragStopHandler);
	};

	const isValidHovering = ref(false);

	// While moving Mouse or Touch:
	const dragHandler = (vertical: number, horizontal: number) => {
		isValidHovering.value = isOverValidDropOnComponent(props.dragInfo?.dragType);
		dragCurrentLocation.value = props.bounds
			? checkBounds(vertical, horizontal)
			: [
					`${props.preventY ? dragStartingLocation.value[0] : vertical + 'px'}`,
					`${props.preventX ? dragStartingLocation.value[1] : horizontal + 'px'}`,
			  ];
	};

	// When dropped, clean-up, and if applicable, run drop handler
	const dragStopHandler = () => {
		cleanupSideEffects();
		// Run drop handler only if dragType, dragId, and callback were provided
		if (props.dragInfo) {
			// If user passed in a callback to check if element can be dropped or not
			if (
				props.canBeDropped &&
				!props.canBeDropped(props.dragInfo.dragType, props.dragInfo.dragId)
			) {
				dragCurrentLocation.value = [...dragStartingLocation.value];
				return;
			}
			const intoDropElementIndex = getEligibleDropId(
				props.dragInfo.dragType,
				props.dragInfo.dropId,
			);
			if (intoDropElementIndex !== null) {
				props.dragInfo.dropHandler(
					props.dragInfo.dragType,
					props.dragInfo.dragId,
					intoDropElementIndex,
					props.dragInfo.dropId,
				);
			} else {
				dragCurrentLocation.value = [...dragStartingLocation.value];
			}
		}
	};
</script>

<template>
	<div
		ref="DragOnReference"
		class="DragOn"
		:class="{ [String(props.hoverClass)]: isValidHovering }"
		@mousedown.prevent="mouseDragStartHandler"
		@touchstart.prevent="touchDragStartHandler"
		:style="styleObject"
		:disabled="props.disabled">
		<slot></slot>
	</div>
</template>

<style scoped>
	.DragOn {
		position: v-bind('props.dragInfo && !props.disabled ? "relative" : "absolute"');
		top: v-bind('dragCurrentLocation[0]');
		left: v-bind('dragCurrentLocation[1]');
	}

	.DragOn:active {
		position: absolute;
	}
</style>
