import {useStateValue} from '../../utils/StateProvider';
import {UPDATE_DATA_OPTIONS} from '../../utils/actionType';
import {Switch} from 'antd';
import FieldLabel from './FieldLabel';
import React, {useRef, useEffect} from 'react';

const SwitchField = (props) => {
	const {id, field} = props;
	const {value, help} = field;
	const switchRef = useRef();

	if (id === 'active') {
		// console.log(props)
		// console.log(value)
	}

	useEffect(() => {

		const switchWrap = switchRef.current.closest('.ant-modal-body');

		if (id === 'active') {
			if (value === 'on') {
				switchWrap.classList.remove('is-disable');
			} else {
				switchWrap.classList.add('is-disable');
			}
		}


	}, [value]);

	const fieldType = props.field?.fieldType;
	const parentId = props.field?.parentId;
	const index = props.field?.index;
	const repeaterData = props.field?.repeaterData;

	if (!id) return;
	const [data, dispatch] = useStateValue();
	return (
		<div className="rtsb-field switch" ref={switchRef}>
			<FieldLabel field={props.field}/>
			<div className="rtsb-field__content">
				<div className="rtsb-field-control">
					<Switch
						checkedChildren="On"
						unCheckedChildren="Off"
						checked={value === 'on'}
						onChange={(checked) => {
							dispatch({
								type: UPDATE_DATA_OPTIONS,
								id: id,
								value: checked ? 'on' : '',
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
						dangerouslySetInnerHTML={{__html: help}}
					/>
				)}
			</div>
		</div>
	);
};

export default SwitchField;
