import { useStateValue } from '../../utils/StateProvider';
import { UPDATE_DATA_OPTIONS } from '../../utils/actionType';
import { DatePicker } from 'antd';
import FieldLabel from './FieldLabel';
import dayjs from 'dayjs';

const DateTime = ( props ) => {
	const { help, value, placeholder } = props.field;
	const id = props.id;
	const fieldType = props.field?.fieldType;
	const parentId = props.field?.parentId;
	const index = props.field?.index;
	const repeaterData = props.field?.repeaterData;
	const format = props.field?.format;

	const [ data, dispatch ] = useStateValue();

	return (
		<div className="rtsb-field datetime">
			<FieldLabel field={ props.field } />
			<div className="rtsb-field__content">
				<div className="rtsb-field-control">
					<DatePicker
						className="rtsb-form-field"
						value={ dayjs( value ) }
						placeholder={ placeholder }
						onChange={ ( date, dateString ) => {
							dispatch( {
								type: UPDATE_DATA_OPTIONS,
								value: dateString,
								id,
								fieldType,
								parentId,
								repeaterData,
								index,
							} );
						} }
						format={ format }
						allowClear={ false }
						showTime
					/>
				</div>
				{ help && (
					<div
						className="rtsb-field__help"
						dangerouslySetInnerHTML={ { __html: help } }
					/>
				) }
			</div>
		</div>
	);
};

export default DateTime;

// Documentation link
// https://ant.design/components/date-picker
// https://day.js.org/docs/en/display/format#docsNav
