import Switch from './fields/Switch';
import Text from './fields/Text';
import Select from './fields/Select';
import Number from './fields/Number';
import { useStateValue } from '../utils/StateProvider';
import _ from 'lodash';
import Raw from './fields/Raw';
import Title from './fields/Title';
import ColorGradient from './fields/ColorGradient';
import Sortable from './fields/Sortable';
import Color from './fields/Color';
import CheckBoxGroup from './fields/CheckBoxGroup';
import DateTime from './fields/DateTime';
import { jsonStringToObject } from '../utils/helper';
import FileUpload from './fields/FileUpload';
import MultipleSelect from './fields/MultipleSelect';
import ImageSelect from './fields/ImageSelect';
import TextSelect from './fields/TextSelect';
import Description from './fields/Description';


const Field = (props) => {
	const { fieldType, type, dependency } = props.field;
	const [data, dispatch] = useStateValue();
	const checkConditions = () => {
		if (dependency && !_.isEmpty(dependency)) {
			const { rules, relation } = dependency;
			const status = rules.map((rule) => {
				const { item, value: ruleValue, operator } = rule;
				const [sectionId, listItemId, fieldId, repeaterFieldId] =
					item.split('.');

				const field =
					data.sections[sectionId]?.list[listItemId]?.fields[fieldId];
				let dataValue = field?.value || '';

				if ('repeater' === fieldType && 'on' !== field?.value) {
					const objValue = jsonStringToObject(field?.value || {});
					dataValue = objValue[props.field.index]?.[repeaterFieldId];
				}

				if ('search_and_multi_select' === field?.type) {
					dataValue = dataValue.map((item) => {
						const convertedObject =
							'string' === typeof item ? JSON.parse(item) : item;
						return convertedObject.value;
					});
				}

				if ( 'checkbox' === field?.type || 'search_and_multi_select' === field?.type ) {
					if ('in' === operator.toLowerCase() || '==' === operator) {
						if (Array.isArray(ruleValue)) {
							return ruleValue.every((value) => {
								return dataValue.includes(value);
							});
						}
						return dataValue.includes(ruleValue);
					} else if (
						'!in' === operator.toLowerCase() ||
						'!=' === operator
					) {
						if (Array.isArray(ruleValue)) {
							return !ruleValue.every((value) => {
								return dataValue.includes(value);
							});
						}
						return !dataValue.includes(ruleValue);
					} else if ('any' === operator.toLowerCase()) {
						if (Array.isArray(ruleValue)) {
							return ruleValue.some((value) => {
								return dataValue.includes(value);
							});
						}
					} else if ('empty' === operator.toLowerCase()) {
						return 0 >= dataValue.length;
					} else if ('!empty' === operator.toLowerCase()) {
						return dataValue.length > 0;
					}
				} else if ( 'in' === operator.toLowerCase() ) {
					return ruleValue.includes(dataValue);
				}  else if ( '!in' === operator.toLowerCase() ) {
					return !ruleValue.includes(dataValue);
				} else if ('==' === operator) {
					if (dataValue === ruleValue) {
						return true;
					}
				} else if ('!=' === operator) {
					if (dataValue != ruleValue) {
						return true;
					}
				}
				return false;
			});
			if (status.length === 1) {
				return status[0];
			}
			if (relation && 'or' === relation.toLowerCase()) {
				return status.some((item) => item);
			}

			return status.every((item) => item);
		}
		return true;
	};
	if (!checkConditions()) {
		return;
	}
	if (type === 'switch') {
		return <Switch id={props.id} field={props.field} />;
	} else if (type === 'checkbox') {
		return <CheckBoxGroup id={props.id} field={props.field} />;
	} else if (type === 'select') {
		return <Select id={props.id} field={props.field} />;
	} else if (type === 'number') {
		return <Number id={props.id} field={props.field} />;
	} else if (type === 'sortable') {
		return <Sortable id={props.id} field={props.field} />;
	} else if (type === 'title') {
		return <Title id={props.id} field={props.field} />;
	} else if (type === 'description') {
		return <Description id={props.id} field={props.field} />;
	} else if (type === 'datetime') {
		return <DateTime id={props.id} field={props.field} />;
	} else if (type === 'color') {
		return <Color id={props.id} field={props.field} />;
	} else if (type === 'fileupload') {
		return <FileUpload id={props.id} field={props.field} />;
	} else if (type === 'gradient') {
		return <ColorGradient id={props.id} field={props.field} />;
	} else if (type === 'search_and_multi_select') {
		return <MultipleSelect id={props.id} field={props.field} />;
	} else if (type === 'image_select') {
		return <ImageSelect id={props.id} field={props.field} />;
	} else if (type === 'text_select') {
		return <TextSelect id={props.id} field={props.field} />;
	} else if (type === 'raw') {
		return <Raw id={props.id} field={props.field} />;
	}
	return <Text id={props.id} field={props.field} />;
};

export default Field;
