/* eslint-disable no-mixed-spaces-and-tabs */
// Drag (and) Drop Store used to store drop elements references, and handle logic with dragging/dropping elements
// export const useDragDropStore = defineStore('dragAndDropStore', () => {
// State:
// References to each DropElements div to check bounding client
// index for easier comparisons and handling logic

export type dragOnTypes = (number | string)[];
export type dragOnType = number | string;
export type dropOnId = number | string;

export const dropElements: {
	[key: string]: (number | string)[];
} = {};

let hoveringOver: { dragOnType: dragOnTypes | dragOnType; dropOnId: dropOnId } | null = null;

// Methods:

// When Drop element is mounted, add ref to state for easy reference
const registerDropComponent = (dragOnType: dragOnType, dropOnId: dropOnId) => {
	if (!Array.isArray(dropElements[dragOnType])) {
		dropElements[dragOnType] = [];
	}
	if (dropElements[dragOnType].includes(dropOnId)) {
		throw new Error('DropOn Components needs a unique "DropOnId" for each unique "dragOnType');
	}
	dropElements[dragOnType].push(dropOnId);
};

export const registerDropComponents = (
	dragOnType: dragOnTypes | dragOnType,
	dropOnId: dropOnId,
): void => {
	if (Array.isArray(dragOnType)) {
		for (let i = 0; i < dragOnType.length; ++i) {
			registerDropComponent(dragOnType[i], dropOnId);
		}
	} else {
		registerDropComponent(dragOnType, dropOnId);
	}
};

// Remove element ref from state if the element unmounts (handled in DropElement.vue)
const deregisterDropComponent = (dragOnType: dragOnType, dropOnId: dropOnId) => {
	if (!Array.isArray(dropElements[dragOnType])) {
		return false;
	}
	const removalIndex = dropElements[dragOnType].findIndex((element) => element === dropOnId);
	if (removalIndex === -1) {
		return false;
	}
	dropElements[dragOnType].splice(removalIndex, 1);
	if (dropElements[dragOnType].length === 0) {
		delete dropElements[dragOnType];
	}
	return true;
};
export const deregisterDropComponents = (
	dragOnType: dragOnTypes | dragOnType,
	dropOnId: dropOnId,
): boolean => {
	if (Array.isArray(dragOnType)) {
		for (let i = 0; i < dragOnType.length; ++i) {
			deregisterDropComponent(dragOnType[i], dropOnId);
		}
		return true;
	} else {
		return deregisterDropComponent(dragOnType, dropOnId);
	}
};

// Optional: Used when user passes in a hoverHandler in DragElement.vue
// Use-Case: User wants a Card to glow when being held over a valid dropElement
export const isOverValidDropOnComponent = (dragType: dragOnType | undefined) =>
	dragType === hoveringOver?.dragOnType;

// Check if the location the DragElement is being dropped is within a valid DropElement
// On a successful drop, return identifier of the DropElement that DragElement is over
export const getEligibleDropId = (dragType: dragOnType, fromDropId: dropOnId) =>
	dragType === hoveringOver?.dragOnType && fromDropId !== hoveringOver.dropOnId
		? hoveringOver.dropOnId
		: null;

// Update which element, if any, is being hovered over currently
export const setHoveredDropOnComponent = (
	dropOver: {
		dragOnType: dragOnTypes | dragOnType;
		dropOnId: dropOnId;
	} | null,
) => (hoveringOver = dropOver);
