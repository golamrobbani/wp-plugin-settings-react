import { useStateValue } from '../../utils/StateProvider';
import { UPDATE_DATA_OPTIONS } from '../../utils/actionType';
import { Radio, Image } from 'antd';
import FieldLabel from './FieldLabel';

const TextSelect = (props) => {
	const { id, field } = props;
	const { value, help, options, empty, searchable } = field;
	const fieldType = props.field?.fieldType;
	const parentId = props.field?.parentId;
	const index = props.field?.index;
	const repeaterData = props.field?.repeaterData;
	const [data, dispatch] = useStateValue();

	return (
		<div className="rtsb-field rtsb-text-select-field">
			<FieldLabel field={props.field} />

			<div className="rtsb-field__content">
				<div className="rtsb-field-control">
					<Radio.Group
						size="large"
						value={value}
						onChange={(event) => {
							dispatch({
								type: UPDATE_DATA_OPTIONS,
								id,
								value: event.target.value,
								fieldType,
								parentId,
								repeaterData,
								index,
							});
						}}
						buttonStyle="solid"
					>
						{Object.keys(options).map((option_key) => {
							return (
								<Radio.Button
									key={option_key}
									value={option_key}
								>
									{options[option_key]}
								</Radio.Button>
							);
						})}
					</Radio.Group>
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

export default TextSelect;
