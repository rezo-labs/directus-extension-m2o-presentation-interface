import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'm2o-presentation',
	name: 'M2O Presentation',
	icon: 'content_copy',
	description: 'A presentation interface for displaying a field of a many-to-one field',
	component: InterfaceComponent,
	options: [
	],
	types: ['alias'],
	localTypes: ['presentation'],
	group: 'presentation',
});
