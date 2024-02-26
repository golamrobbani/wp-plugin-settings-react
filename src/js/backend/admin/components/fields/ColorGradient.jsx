import {ColorPicker} from 'antd';
import {useStateValue} from '../../utils/StateProvider';
import {UPDATE_DATA_OPTIONS} from '../../utils/actionType';
import FieldLabel from './FieldLabel';
import React, {useRef, useState} from 'react';

const ColorGradient = (props) => {

	const items = props.field.items;
	const {help, value, default_val} = props.field.items;

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
					{Object.keys(items).map((item, i) => {
						const id = items[item].id;
						return (
							<ColorPicker
								key={i}
								format={'hex'}
								value={items[item].value}
								defaultValue={items[item].default_val}
								allowClear
								onChange={colorValue => {
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

									setCheckClick('no')
								}}
							/>
						)

					})}


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

export default ColorGradient;
