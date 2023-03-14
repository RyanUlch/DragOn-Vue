const dropElements: {
	[key: string]: (number | string)[];
} = {};
export let hoveringOver: { dropId: number; dropType: number | string } | null = null;

// When Drop element is mounted, add ref to state for easy reference
export const registerDropElement = (
	dragType: number | string,
	dropIndex: number | string,
): void => {
	if (!Array.isArray(dropElements[dragType])) {
		dropElements[dragType] = [];
	}
	dropElements[dragType].push(dropIndex);
};

// Remove element ref from state if the element unmounts (handled in DropElement.vue)
export const deregisterDropElement = (dragType: number | string, dropIndex: number): boolean => {
	if (!Array.isArray(dropElements[dragType])) {
		return false;
	}
	const removalIndex = dropElements[dragType].findIndex((element) => element === dropIndex);
	if (removalIndex === -1) {
		return false;
	}
	dropElements[dragType].splice(removalIndex, 1);
	if (dropElements[dragType].length === 0) {
		delete dropElements[dragType];
	}
	return true;
};

// Update which element, if any, is being hovered over currently
const setHoveredDropElement = (dropOver: { dropId: number; dropType: number | string } | null) => {
	hoveringOver = dropOver;
};

// Set store with the current DropElement ID and Type when a pointer enters the bounds of the element. Set to null when leaving.
export const updateHoverHandler = (
	dropElementIndex?: number,
	dragElementType?: string | number,
) => {
	if (dropElementIndex !== undefined && dragElementType !== undefined) {
		setHoveredDropElement({ dropId: dropElementIndex, dropType: dragElementType });
	} else {
		setHoveredDropElement(null);
	}
};
