import { useStateValue } from '../../utils/StateProvider';
import { UPDATE_DATA_OPTIONS } from '../../utils/actionType';
import { InputNumber } from 'antd';
import FieldLabel from './FieldLabel';
const Number = (props) => {
	const { help, value, placeholder, size, min, max } = props.field;
	const id = props.id;
	const [data, dispatch] = useStateValue();

	const fieldType = props.field?.fieldType;
	const parentId = props.field?.parentId;
	const index = props.field?.index;
	const repeaterData = props.field?.repeaterData;

	return (
		<div className="rtsb-field text">
			<FieldLabel field={props.field} />

			<div className="rtsb-field__content">
				<div className="rtsb-field-control">
					<InputNumber
						className="rtsb-form-field"
						size={size}
						min={min}
						max={max}
						defaultValue={ 'null' !== value ? value : '' }
						placeholder={placeholder}
						value={ 'null' !== value ? value : '' }
						onChange={(value) => {
							dispatch({
								type: UPDATE_DATA_OPTIONS,
								id: id,
								value: value,
								fieldType,
								parentId,
								repeaterData,
								index
							});
						}}
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

export default Number;
