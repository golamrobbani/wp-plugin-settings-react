import React from 'react';
import { Checkbox } from 'antd';
import { useStateValue } from '../../utils/StateProvider';
import FieldLabel from './FieldLabel';
import { UPDATE_DATA_OPTIONS } from '../../utils/actionType';

const CheckboxGroup = Checkbox.Group;

const CheckBoxGroup = (props) => {
	const { id, field } = props;
	const { value, help, options, empty, searchable, orientation } = field;
	const [data, dispatch] = useStateValue();

	const fieldType = props.field?.fieldType;
	const parentId = props.field?.parentId;
	const index = props.field?.index;
	const repeaterData = props.field?.repeaterData;

	const onChange = (_values) => {
		dispatch({
			type: UPDATE_DATA_OPTIONS,
			id,
			value: _values,
			fieldType,
			parentId,
			repeaterData,
			index,
		});
	};

	return (
		<div className={`rtsb-field checkbox-group-wrap field-${id}`}>
			<FieldLabel field={field} />

			<div className="rtsb-field__content">
				<div className="rtsb-field-control">
					<CheckboxGroup
						className={`rtsb-checkbox-group ${
							orientation || 'vertical'
						}`}
						options={options}
						value={value}
						onChange={onChange}
					/>
				</div>
				{help && (
					<div
						className="rtsb-field__help"
						dangerouslySetInnerHTML={{ __html: help }}
					/>
				)}
			</div>
		</div>
	);
};

export default CheckBoxGroup;
