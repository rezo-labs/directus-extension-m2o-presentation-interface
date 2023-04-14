import { defineInterface, useStores } from '@directus/extensions-sdk';
import { Field } from '@directus/shared/types';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'm2o-presentation',
	name: 'M2O Presentation',
	icon: 'content_copy',
	description: 'A presentation interface for displaying a field of a many-to-one field',
	component: InterfaceComponent,
	options: (ctx) => {
		const fieldsStore = useStores().useFieldsStore();
		const relationsStore = useStores().useRelationsStore();

		const fields = (fieldsStore.getFieldsForCollection(ctx.collection) as Field[])
			.filter((f) => ['string', 'integer', 'uuid'].includes(f.type))
			.filter((f) => f.field !== fieldsStore.getPrimaryKeyFieldForCollection(ctx.collection)?.field);

		let m2oFields: Field[] = [];
		if (ctx.field.meta?.options?.m2oField) {
			const relation = relationsStore.getRelationForField(ctx.collection, ctx.field.meta?.options?.m2oField);
			if (relation) {
				m2oFields = fieldsStore.getFieldsForCollection(relation.related_collection);
			}
		}

		return [
			{
				field: 'm2oField',
				type: 'string',
				name: 'M2O Field',
				meta: {
					interface: 'select-dropdown',
					options: {
						choices: fields.map((field) => ({
							text: field.name,
							value: field.field,
						})),
					},
				},
			},
			{
				field: 'presentationField',
				type: 'string',
				name: 'Presentation Field',
				meta: {
					interface: 'select-dropdown',
					options: {
						choices: m2oFields.map((field) => ({
							text: field.name,
							value: field.field,
						})),
					},
				},
			},
			{
				field: 'errorMsg',
				type: 'string',
				name: 'Error Message',
				meta: {
					interface: 'system-input-translated-string',
					options: {
						placeholder: 'An error occurred while fetching the related item.',
					},
				},
			},
		];
	},
	types: ['alias'],
	localTypes: ['presentation'],
	group: 'presentation',
});
