<template>
	<div class="m2o-presentation">
		<v-skeleton-loader v-if="loading" />

		<v-notice v-else-if="error" type="info">
			{{ errorMsg }}
		</v-notice>

		<component
			:is="
				fieldMeta.meta && fieldMeta.meta.interface
					? `interface-${fieldMeta.meta.interface}`
					: `interface-input`
			"
			v-else-if="fieldMeta"
			v-bind="(fieldMeta.meta && fieldMeta.meta.options) || {}"
			:autofocus="false"
			:disabled="true"
			:value="value"
			:width="(fieldMeta.meta && fieldMeta.meta.width) || 'full'"
			:type="fieldMeta.type"
			:collection="fieldMeta.collection"
			:field="fieldMeta.field"
			:field-data="fieldMeta"
			:primary-key="m2oPrimaryKey"
			:length="fieldMeta.schema && fieldMeta.schema.max_length"
		/>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref, watch } from 'vue';
import { useStores, useApi } from '@directus/extensions-sdk';
import { Field } from '@directus/shared/types';

export default defineComponent({
	props: {
		collection: {
			type: String,
			required: true,
		},
		m2oField: {
			type: String,
			required: true,
		},
		presentationField: {
			type: String,
			required: true,
		},
		errorMsg: {
			type: String,
			default: 'An error occurred while fetching the related item.',
		},
	},
	setup(props) {
		const values = inject('values', ref<Record<string, any>>({}));
		const value = ref(null);
		const loading = ref(false);
		const error = ref(null);

		const relationsStore = useStores().useRelationsStore();
		const fieldsStore = useStores().useFieldsStore();

		const relatedCollection = computed(() => {
			if (props.m2oField) {
				const relation = relationsStore.getRelationForField(props.collection, props.m2oField);
				return relation?.related_collection;
			}
		});

		const primaryKeyField = computed(() => 
			(fieldsStore.getPrimaryKeyFieldForCollection(relatedCollection.value) as Field | null)?.field || 'id'
		);
		const fieldMeta = computed(() => {
			if (relatedCollection.value) {
				return (fieldsStore.getField(relatedCollection.value, props.presentationField) as Field | null);
			}
		});

		const m2oValue = computed(() => values.value[props.m2oField]);
		const isObject = computed(() => 
			typeof m2oValue.value === 'object' && m2oValue.value !== null
		);
		const isPrimitive = computed(() => 
			typeof m2oValue.value === 'string' || typeof m2oValue.value === 'number'
		);

		const m2oPrimaryKey = computed<string | number | null>(() => {
			if (isObject.value) {
				return m2oValue.value[primaryKeyField.value];
			} else if (isPrimitive.value) {
				return m2oValue.value;
			}
			return null;
		});

		const api = useApi();

		watch(values, () => {
			getValue();
		}, { immediate: true });

		return { value, loading, error, m2oPrimaryKey, fieldMeta };

		async function getValue() {
			if (isObject.value) {
				value.value = m2oValue.value[props.presentationField];
			}
			// Call API to get item data
			else if (isPrimitive.value) {
				loading.value = true;
				try {
					const { data } = (await api.get(`/items/${relatedCollection.value}/${m2oValue.value}`, {
						params: {
							fields: [props.presentationField],
						},
					})).data;
					value.value = data[props.presentationField];
				} catch (err) {
					error.value = err;
				} finally {
					loading.value = false;
				}
			}
			else {
				value.value = null;
			}
		}
	},
});
</script>

<style scoped>
</style>
