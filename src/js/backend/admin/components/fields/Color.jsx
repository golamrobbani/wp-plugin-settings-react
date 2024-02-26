import {ColorPicker} from 'antd';
import {useStateValue} from '../../utils/StateProvider';
import {UPDATE_DATA_OPTIONS} from '../../utils/actionType';
import FieldLabel from './FieldLabel';
import React, {useRef, useState} from 'react';

const Color = (props) => {
	const {help, value, default_val} = props.field;
	const id = props.id;
	const [data, dispatch] = useStateValue();
	const [checkClick, setCheckClick] = useState('yes');

	const colorRef = useRef();

	const fieldType = props.field?.fieldType;
	const parentId = props.field?.parentId;
	const index = props.field?.index;
	const repeaterData = props.field?.repeaterData;

	return (
		<div className="rtsb-field text">
			<FieldLabel field={props.field}/>

			<div className="rtsb-field__content">
				<div className="rtsb-field-control"
					 ref={colorRef}>

					<ColorPicker
						format={'hex'}
						value={value}
						defaultValue={default_val}
						allowClear
						onChange={(colorValue) => {
							if (checkClick === 'yes') {
								if (colorValue.metaColor.roundA == 0) {
									colorValue.metaColor.roundA = 1;
								}
							}
							setCheckClick('no')
							dispatch({
								type: UPDATE_DATA_OPTIONS,
								id,
								value: colorValue.metaColor.roundA ? colorValue.toRgbString() : '',
								fieldType,
								parentId,
								repeaterData,
								index
							});
						}}

						onClear={() => {
							dispatch({
								type: UPDATE_DATA_OPTIONS,
								id,
								value: default_val ?? '',
								fieldType,
								parentId,
								repeaterData,
								index
							});

							setTimeout(function () {
								if (default_val) {

									const antColorPicker = colorRef.current.querySelector('.ant-color-picker-clear');
									antColorPicker.classList.add('rtrb-color-picker-reset');
									antColorPicker.style.backgroundColor = default_val;
								}
								/*else {

									const antColorInput = document.querySelectorAll('.ant-popover.ant-color-picker');
									antColorInput.forEach(item=>{
										const antColorInputVal = item.querySelector('input.ant-input')
										console.log(antColorInputVal)
										antColorInputVal.value = '';
									})
								}*/

							}, 200);

							setCheckClick('no')
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

export default Color;
