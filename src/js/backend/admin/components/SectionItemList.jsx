import SectionItems from './SectionItems';
import { useEffect, useState } from 'react';

const SectionItemList = ( props ) => {
	const { list, categories } = props.section;
	const [ activeCat, setActiveCat ] = useState( null );
	const catNavId = 'selected_cat_nav_id_' + props.section.id;
	const lastSelected = localStorage.getItem( catNavId ) ? localStorage.getItem( catNavId ) : Object.keys( categories )[ 0 ];
	useEffect( () => {
		setActiveCat( lastSelected );
	}, [ props.section.id ] );

	return (
		<div className="rtsb-ss-item-list-wrap">
			{ categories ? (
				<div className="rtsb-cat-tabs-wrap">
					{ Object.keys( categories ).length > 0
						? <div className="rtsb-cat-nav-wrap">
							{ Object.keys( categories ).map( ( cat_key ) => {
								const { title, description } = categories[ cat_key ];
								return (
									<div
										key={ cat_key }
										onClick={ () => {
											localStorage.setItem( catNavId, cat_key );
											setActiveCat( cat_key );
										}
										}
										className={ `rtsb-cat-nav${
											cat_key === activeCat
												? ' active'
												: ''
										}` }
									>
										<h3 className="rtsb-title">{ title }</h3>
									</div>
								);
							} ) }
						</div> : null }
					<div className="rtsb-cat-content">
						{ categories[ activeCat ]?.description &&
							<h4 className="rtsb-cat-description">
								{ categories[ activeCat ]?.description }
							</h4>
						}
						<SectionItems
							blocks={ list }
							saveData={ props.saveData }
							category={ activeCat }
						/>
					</div>
				</div>
			) : (
				<SectionItems blocks={ list } />
			) }
		</div>
	);
};

export default SectionItemList;
