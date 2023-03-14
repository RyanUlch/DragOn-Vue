/* eslint-disable no-mixed-spaces-and-tabs */

// State:
import { hoveringOver } from './dropHelpers';

// Methods:

// Optional: Used when user passes in a hoverHandler in DragElement.vue
// Use-Case: User wants a Card to glow when being held over a valid dropElement
export const isHoveringOverValidElement = (dragType: number | string | undefined) => {
	return dragType === hoveringOver?.dropType;
};

// Check if the location the DragElement is being dropped is within a valid DropElement
// On a successful drop, return identifier of the DropElement that DragElement is over
export const getEligibleDropID = (dragType: number | string, fromDropId: number | string) => {
	if (dragType === hoveringOver?.dropType && fromDropId !== hoveringOver.dropId) {
		return hoveringOver.dropId;
	} else {
		return null;
	}
};
