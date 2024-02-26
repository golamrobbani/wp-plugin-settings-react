/* global rtsbParams */

import { useEffect } from 'react';
import Section from './Section';
import { useStateValue } from '../utils/StateProvider';
import {
	SECTION_ID,
	UPDATE_DATA_ITEM,
	UPDATE_STATE_ITEM,
} from '../utils/actionType';
import { notification } from 'antd';

const App = () => {
	const [data, dispatch] = useStateValue();

	// console.log( data )
	const saveData = (_data, _callback) => {
		dispatch({
			type: UPDATE_STATE_ITEM,
			value: { saving: true },
		});
		const paramsData = _data ? _data : data.data;
		const formData = new FormData();
		formData.append('section_id', paramsData.section_id);
		formData.append('block_id', paramsData.block_id);
		//
		for (const [_key, _value] of Object.entries(paramsData.options)) {
			if (Array.isArray(_value)) {
				if (_value.length) {
					console.log( _value )
					_value.map((_item) => {
						let theItem = _item;
						if (typeof _item === 'object' && _item !== null){
							theItem = JSON.stringify(_item);
						}
						formData.append('options[' + _key + '][]', theItem);
					});
				} else {
					formData.append('options[' + _key + ']', []);
				}
			} else if (typeof _value === 'object' && _value !== null) {
				const serializedData = JSON.stringify(_value);
				formData.append('options[' + _key + ']', serializedData );
			} else {
				formData.append('options[' + _key + ']', _value);
			}
		}
		formData.append('action', 'rtsb_save_settings_data');
		formData.append('__rtsb_wpnonce', rtsbParams.nonce );
		jQuery.ajax({
			cache: false,
			processData: false,
			contentType: false,
			dataType: 'json',
			url: rtsbParams.ajaxurl,
			data: formData,
			method: 'POST',
			success(res) {
				if (res.success) {
					notification.success({
						message: res.data.message,
						placement: 'bottomRight',
					});
					dispatch({
						type: UPDATE_STATE_ITEM,
						value: {
							saving: false,
							callSave: false,
							dirty: false,
							placement: 'bottomRight',
						},
					});
					dispatch({
						type: UPDATE_STATE_ITEM,
						value: { modalVisible: false },
					});
				} else {
					notification.error({
						message: res.data.message,
						placement: 'bottomRight',
					});
					dispatch({
						type: UPDATE_STATE_ITEM,
						value: { saving: false, callSave: false },
					});
				}
				_callback && _callback();
			},
			error(error) {
				notification.error({
					message: error.message,
					placement: 'bottomRight',
				});
				dispatch({
					type: UPDATE_STATE_ITEM,
					value: { saving: false, callSave: false },
				});
				_callback && _callback();
			},
		});
	};
	useEffect(() => {
		if (data.callSave && !data.saving) {
			saveData();
		}
	}, [data.callSave]);
	return (
		<div className="rtsb-settings-page-wrapper">
			<div className="rtsb-header-area">
				<div className="rtsb-header-logo-wrap">
					<img
						src={`${rtsbParams.homeurl}/wp-content/plugins/shopbuilder/assets/images/icon/ShopBuilder-Logo.svg`}
						alt="ShopBuilder"
						loading="lazy"
					/>
				</div>
				<div className="rtsb-header-title-wrap">
					<h2 className="rtsb-title">ShopBuilder Settings</h2>
				</div>
			</div>
			<div className="rtsb-settings-tabs-wrap">
				<div className="rtsb-tabs-nav-wrap">
					<ul className="rtsb-tab-list">
						{Object.keys(data.sections).map((section_key) => {
							return (
								<li key={section_key}>
									<a
										href="#"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											e.nativeEvent.stopImmediatePropagation();
											localStorage.setItem( "rtsb_selected_section_nav", section_key );
											dispatch({
												type: UPDATE_DATA_ITEM,
												id: SECTION_ID,
												value: section_key,
											});
										}}
										className={`rtsb-button${
											section_key === data.data.section_id
												? ' active'
												: ''
										}`}
									>
										<span>
											{data.sections[section_key].title}
										</span>
									</a>
								</li>
							);
						})}
					</ul>
				</div>

				<div className="rtsb-tabs-content-wrap">
					<div
						className={`rtsb-settings-tab-content rtsb-settings-${data.data.section_id}`}
					>
						<Section
							id={data.data.section_id}
							saveData={saveData}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
