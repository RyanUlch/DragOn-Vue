import {
	dropElements,
	registerDropComponents,
	deregisterDropComponents,
} from '../src/helpers/dragOnHelpers';
import { test, describe, expect, beforeAll } from 'vitest';

describe('Drag Drop Store', () => {
	describe('registerDropElement', () => {
		test.fails('there is no elements on initialization', () => {
			expect(dropElements).toHaveProperty('Card');
		});

		test('registers a new DropElement', () => {
			registerDropComponents('Card', 0);
			expect(dropElements['Card']).toHaveLength(1);
		});

		test('newly registered DropElement contains correct info', () => {
			expect(dropElements['Card'][0]).toEqual(0);
		});
	});

	describe('deregisterDropElement', () => {
		beforeAll(() => {
			delete dropElements['Card'];
		});
		test('deregisters a given DropElement', () => {
			registerDropComponents('Card', 0);
			registerDropComponents('Card', 1);
			expect(dropElements['Card']).toHaveLength(2);
			deregisterDropComponents('Card', 0);
			expect(dropElements['Card']).toHaveLength(1);
		});

		test('removes property when all DropElements of a given type are deregistered', () => {
			deregisterDropComponents('Card', 1);
			expect(dropElements).not.haveOwnProperty('Card');
		});
	});

	// Working On
	// describe('draggingHandler', () => {
	// 	test('return false when not over a DropElement', () => {
	// 		const store = useDragDropStore();
	// 		const elementRef = ref(document.createElement('div'));
	// 		elementRef.value.setAttribute('height', '100px');
	// 		elementRef.value.setAttribute('width', '100px');
	// 		store.registerDropElement('Card', 0, elementRef);
	// 		store.draggingHandler('Card', [200, 200]);
	// 		expect(store.draggingHandler).toHaveReturnedWith(false);
	// 	});
	// });
});
