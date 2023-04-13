import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'm2o-presentation',
	name: 'M2O Presentation',
	icon: 'content_copy',
	description: 'A presentation interface for displaying a field of a many-to-one field',
	component: InterfaceComponent,
	options: [
		{
			field: 'm2oField',
			type: 'string',
			name: 'M2O Field',
			meta: {
				interface: 'input',
			},
		},
		{
			field: 'presentationField',
			type: 'string',
			name: 'Presentation Field',
			meta: {
				interface: 'input',
			},
		},
	],
	types: ['alias'],
	localTypes: ['presentation'],
	group: 'presentation',
});
