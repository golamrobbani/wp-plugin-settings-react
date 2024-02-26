import { useStateValue } from '../../utils/StateProvider';
import { UPDATE_DATA_OPTIONS } from '../../utils/actionType';
import { Input } from 'antd';
import FieldLabel from './FieldLabel';

const Text = (props) => {
	const { help, value, placeholder } = props.field;
	const id = props.id;
	const fieldType = props.field?.fieldType;
	const parentId = props.field?.parentId;
	const index = props.field?.index;
	const repeaterData = props.field?.repeaterData;

	const [data, dispatch] = useStateValue();
	return (
		<div className="rtsb-field text">
			<FieldLabel field={props.field} />
			<div className="rtsb-field__content">
				<div className="rtsb-field-control">
					<Input
						className="rtsb-form-field"
						placeholder={placeholder}
						value={value}
						onChange={(e) => {
							dispatch({
								type: UPDATE_DATA_OPTIONS,
								id: id,
								value: e.target.value,
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

export default Text;
