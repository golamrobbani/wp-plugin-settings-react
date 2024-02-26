import { useStateValue } from '../../utils/StateProvider';
import { UPDATE_DATA_OPTIONS } from '../../utils/actionType';
import { Select } from 'antd';
import FieldLabel from './FieldLabel';

const { Option } = Select;
const SelectField = (props) => {
	const { id, field } = props;
	const { value, help, options, empty, searchable } = field;
	const fieldType = props.field?.fieldType;
	const parentId = props.field?.parentId;
	const index = props.field?.index;
	const repeaterData = props.field?.repeaterData;

	const [data, dispatch] = useStateValue();
	return (
		<div className="rtsb-field select">
			<FieldLabel field={props.field} />

			<div className="rtsb-field__content">
				<div className="rtsb-field-control">
					<Select
						showSearch={!!searchable}
						value={value}
						onChange={(value) => {
							dispatch({
								type: UPDATE_DATA_OPTIONS,
								id,
								value: value,
								fieldType,
								parentId,
								repeaterData,
								index
							});
						}}
						filterOption={(input, option) =>
							option?.children
								.toLowerCase()
								.includes(input.toLowerCase())
						}
					>
						{empty && <Option value="">{empty}</Option>}
						{Object.keys(options).map((option_key) => {
							return (
								<Option key={option_key} value={option_key}>
									{options[option_key]}
								</Option>
							);
						})}
					</Select>
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

export default SelectField;
