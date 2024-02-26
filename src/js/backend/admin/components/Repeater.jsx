/* eslint-disable */
import { useStateValue } from '../utils/StateProvider';
import Field from './Field';
import { Button, Collapse, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import FieldLabel from "./fields/FieldLabel";
import {UPDATE_DATA_OPTIONS, UPDATE_SECTIONS} from "../utils/actionType";

const { Title } = Typography;

const { Panel } = Collapse;

const PanelStyle = {
	marginBottom: '15px',
	border: '1px solid #d9e3ed',
	borderRadius: '8px',
	background: '#f7fafc',
	padding: 0
}

const Repeater = (props) => {

	const [data, dispatch] = useStateValue();

	const { repeater } = props;

	const { repeat, id } = repeater;

	const [activeKey, setActiveKey] = useState(null );

	const [repeaterData, setRepeaterData] = useState(  [] );

	const [ deleteIconColor, setDeleteIconColor] = useState( 'var(--rtsb-admin-color-secondary)' );

	const repeaterCount = repeaterData.length ;
	const handleAddNewPanel = () => {
		dispatch({
			type: UPDATE_DATA_OPTIONS,
			fieldType: 'repeater',
			repeaterData: repeaterData,
			parentId: id,
			doAction: 'addPanel',
			index: repeaterCount
		});
		setActiveKey(String( repeaterCount ));
	};

	const handleActivePanel = (key ) => {
		const active = key == activeKey ? null : key;
		setActiveKey(String( active ));
	};

	const handleRemovePanel = ( event, removeid ) => {
		event.stopPropagation();
		dispatch({
			type: UPDATE_DATA_OPTIONS,
			fieldType: 'repeater',
			parentId: id,
			doAction: 'remove',
			repeaterData: repeaterData,
			index: removeid
		});
		setRepeaterValue();
	};

	const setRepeaterValue = () => {
		if (!repeater.value) {
			return;
		}
		let repeaterValue = Object.values(
			"string" === typeof repeater.value
				? JSON.parse(repeater.value)
				: repeater.value
		);

		repeaterValue = repeaterValue.map((dataLoop, i) => {
			const obj = {};
			Object.keys(dataLoop).forEach((key) => {
				obj[key] = {
					...repeat[key],
					id: key,
					value: dataLoop[key],
				};
			});
			return obj;
		});
		setRepeaterData(repeaterValue);
	};

	useEffect( () => {
		setRepeaterValue();
	}, [repeater.value] );

	const renderPanels = () => {
		return repeaterData.map(( dataLoop, i ) => {

			return (
				<Panel
					header={
						<>
							<Title level={5} onClick={ () => handleActivePanel( i ) } style={{  margin: 0 }} >
								{ repeaterData[i]?.['title']?.value }
							</Title>

							<DeleteOutlined
								style={{
									position: 'absolute',
									right: '15px',
									top: 0,
									bottom: 0,
									margin: 'auto',
									height: '15px',
									color: deleteIconColor
								}}
								onClick={ ( event ) => handleRemovePanel( event,  i ) }
								onMouseEnter={ () => setDeleteIconColor( 'var(--rtsb-admin-color-secondary-hover)' ) }
								onMouseLeave={ () => setDeleteIconColor( 'var(--rtsb-admin-color-secondary)' ) }
							/>
						</>
					} key={i} style={PanelStyle}>

					<ul className="rtsb_group_repeater">
						{ Object.keys(repeat).map((field_key, index) => {

							const fields = {
								...(  dataLoop[field_key] || repeat[field_key]  ) ,
								fieldType: 'repeater',
								parentId: id,
								index: i,
								repeaterData: repeaterData
							}
							
							return (
								<li key={field_key}>
									<Field key={field_key} id={field_key} field={fields} />
								</li>
							)
						})}
					</ul>
				</Panel>
		) }
		);
	};

	return (
		<div className={`rtsb-repater-wrapper`}>
			<FieldLabel field={repeater} />
			<Collapse
				activeKey={activeKey}
				style={{
					margin: '15px 0',
					border: '0px solid #d9e3ed',
					borderRadius: '8px'
				}}
			>
				{renderPanels()}
			</Collapse>

			<Button
				className={`rtsb-button`}
				onClick={handleAddNewPanel}
				style={{
					fontSize: '14px',
					color: '#fff'
				}}
			>Add New {repeater.label}</Button>
		</div>
	);
};

export default Repeater;
