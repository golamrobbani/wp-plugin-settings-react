/* global wp */
import { useEffect, useState } from 'react';
import { useStateValue } from '../utils/StateProvider';
import { BLOCK_ID, UPDATE_DATA_BLOCK_ID_ACTION, UPDATE_DATA_ITEM, UPDATE_SECTIONS } from '../utils/actionType';
import _ from 'lodash';
import { Button, Modal, notification, Switch, Tooltip } from 'antd';
import { createFromIconfontCN, QuestionCircleOutlined } from '@ant-design/icons';
import ItemSettings from './ItemSettings';
import ModalProInfo from './Modals/ModalProInfo';

const SectionItem = ( props ) => {
	const { title, active, id, fields, external } = props.block;
	const isActive = active === 'on';
	const [ data, dispatch ] = useStateValue();
	const [ modalVisible, setModalVisible ] = useState( false );
	const hasFields = ! _.isEmpty( fields );
	const [ proInfoVisible, setProInfoVisible ] = useState( false );
	const [ pluginData, setPluginData ] = useState( null );
	useEffect( () => {
		if ( ! external ) {
			return;
		}
		jQuery( document ).on( 'wp-plugin-installing', function( e, data ) {
			if ( props.block.pluginSlug === data.slug ) {
				setPluginData( { ...data, status: 'installing' } );
			}
		} );
		jQuery( document ).on( 'wp-plugin-install-success', function( e, _data ) {
			if ( _data.install === 'plugin' && props.block.pluginSlug === _data.slug ) {
				setPluginData( { ..._data, status: 'install-success' } );
				notification.success( {
					message: _data.debug[ 4 ],
					placement: 'bottomRight',
				} );
				const sections = JSON.parse( JSON.stringify( data.sections ) );
				sections[ data.data.section_id ].list[ id ] = { ...props.block, pluginIsInstalled: true };
				dispatch( {
					type: UPDATE_SECTIONS,
					sections,
				} );
			}
		} );
		jQuery( document ).on( 'wp-plugin-install-error', function( e, data ) {
			if ( data.install === 'plugin' && props.block.pluginSlug === data.slug ) {
				notification.error( {
					message: data.errorMessage,
					placement: 'bottomRight',
				} );
				setPluginData( null );
			}
		} );
	}, [] );

	const getPluginBtnText = () => {
		if ( ! props.block.pluginIsInstalled && ! pluginData ) {
			return wp.i18n.__( 'Install' );
		} else if ( props.block.pluginIsInstalled && ! props.block.pluginIsActive ) {
			return wp.i18n.__( 'Activate' );
		} else if ( pluginData?.status === 'installing' ) {
			return wp.i18n.__( 'Installing…' );
		} else if ( pluginData?.status === 'install-success' ) {
			return wp.i18n.__( 'Activate' );
		}
	};

	return (
		<>
			<div
				className={ `rtsb-ss-item ${ props.block.package }${
					isActive ? ' active' : ''
				}${ external ? ' is-external' : '' }` }
				onClick={ ( e ) => {
					e.preventDefault();
					e.stopPropagation();
					if ( true === external ) {

					} else {
						if ( 'pro-disabled' === props.block.package ) {
							setProInfoVisible( true );
							return;
						}

						if ( hasFields ) {
							dispatch( {
								type: UPDATE_DATA_ITEM,
								id: BLOCK_ID,
								value: id,
							} );
							setModalVisible( true );
						} else {
							dispatch( {
								type: UPDATE_DATA_BLOCK_ID_ACTION,
								id,
								value: isActive ? '' : 'on',
							} );
						}
					}
				} }
			>
				<div className="rtsb-ss-item-box">
					<div className="rtsb-ss-item-icon"></div>
					<div className="rtsb-ss-item-content">
						<h3 className="rtsb-ss-item-title">{ title }</h3>
					</div>

					{ external && (
						<>
							<div className="externalActions">
								{ ! props.block.pluginIsActive ? (
									<Button
										type="primary rtsb-button"
										loading={ pluginData?.status === 'installing' }
										onClick={ () => {
											if ( pluginData?.activateUrl ) {
												window.open( pluginData.activateUrl, '_self' );
												return;
											}

											if ( ! props.block.pluginIsInstalled ) {
												wp.updates.installPlugin( {
													slug: props.block.pluginSlug,
												} );
												return;
											}

											if ( props.block.pluginIsInstalled && ! props.block.pluginIsActive ) {
												window.open( props.block.pluginActiveUrl );
											}
										} }
										size="small"
									>
										{ getPluginBtnText() }
									</Button>
								) : (
									<div className="rtsb-ss-item-switch">
										<Switch
											checked={ true }
											disabled
										/>
									</div>
								) }
							</div>
							{ !! props.block.help && <Tooltip title={ props.block.help }><QuestionCircleOutlined style={ { fontSize: '150%' } } /></Tooltip> }
						</>
					) }
					{ ! external && (
						<div className="rtsb-ss-item-switch">
							<Switch
								unCheckedChildren={
									'pro-disabled' === props.block.package ? (
										<span className="dashicons dashicons-lock"></span>
									) : ''
								}
								checked={ isActive }
							/>
						</div>
					) }
					{ hasFields && (
						<div className="rtsb-ss-item-action">
							<span className="dashicons dashicons-admin-generic"></span>
						</div>
					) }
				</div>
			</div>
			{ hasFields && (
				<Modal
					title={ title }
					centered
					open={ modalVisible }
					okText="Save Changes"
					onCancel={ () => setModalVisible( false ) }
					width={ 1000 }
					bodyStyle={ {
						maxHeight: 'calc(100vh - 200px)',
						overflow: 'scroll',
						minHeight: '500px',
					} }
					footer={ [
						<Button
							key="save"
							type="primary"
							loading={ data.saving }
							onClick={ () => {
								props.saveData( null, () => {
									setModalVisible( false );
								} );
							} }
							disabled={ ! data.dirty }
							block
						>
							Save Changes
						</Button>,
					] }
				>
					<ItemSettings block={ props.block } />
				</Modal>
			) }

			{ 'pro-disabled' === props.block.package && (
				<ModalProInfo
					block={ props.block }
					visible={ proInfoVisible }
					setVisible={ setProInfoVisible }
				/>
			) }
		</>
	);
};

export default SectionItem;
