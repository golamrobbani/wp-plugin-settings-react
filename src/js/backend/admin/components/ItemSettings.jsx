/* eslint-disable */
import { useEffect, useState } from 'react';
import Field from './Field';
import Repeater from './Repeater';

const ItemSettings = ( props ) => {
	const { block } = props;
	const { fields } = block;
	const [ activeTab, setActiveTab ] = useState( () =>
		block.tabs ? Object.keys( block.tabs )[ 0 ] : ''
	);

	const enableField = {
		...block.active_field,
		type: 'switch',
		value: block.active,
	};

	return (
		<div
			className={ `rtsb-block-settings${
				block.tabs ? ' rtsb-block-tabs' : ''
			}` }
		>
			{ block.tabs ? (
				<ul className="rtsb-block-tab-nav">
					{ Object.keys( block.tabs ).map( ( tab_key ) => {
						return (
							<li
								key={ tab_key }
								className={ `rtsb-block-tab-nav-item${
									tab_key === activeTab ? ' active' : ''
								}` }
								onClick={ () => setActiveTab( tab_key ) }
							>
								{ block.tabs[ tab_key ].title }
							</li>
						);
					} ) }
				</ul>
			) : (
				''
			) }
			<div className="rtsb-block-settings-content">
				{ ! enableField.disable &&
                    ( ! block.tabs ||
                        ( block.tabs &&
                            Object.keys( block.tabs )[ 0 ] === activeTab ) ) && (
					<div className="block-active-field">
						<Field id="active" field={ enableField } />
					</div>
				) }

				{ Object.keys( fields ).map( ( field_key ) => {
					if ( 'repeaters' === fields[ field_key ].type ) {
						return;
					}
					if (
						block.tabs &&
                        activeTab &&
                        activeTab !== fields[ field_key ].tab
					) {
						return;
					}
					return (
						<Field
							key={ field_key }
							id={ field_key }
							field={ fields[ field_key ] }
						/>
					);
				} ) }

				{ Object.keys( fields ).map( ( field_key, index ) => {
					if ( 'repeaters' !== fields[ field_key ].type ) {
						return;
					}
					if ( block.tabs && activeTab && activeTab !== fields[ field_key ].tab ) {
						return;
					}

					return(
						<Repeater key={ index } repeater={ fields[ field_key ] } />
					);
				} ) }

			</div>
		</div>
	);
};

export default ItemSettings;
