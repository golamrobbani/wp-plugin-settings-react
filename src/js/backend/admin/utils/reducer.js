/* global rtsbParams */
import {
	UPDATE_DATA_BLOCK_ID_ACTION,
	UPDATE_DATA_ITEM,
	UPDATE_DATA_OPTIONS,
	UPDATE_SECTIONS,
	UPDATE_STATE_ITEM,
} from './actionType';

export const initialState = {
	callSave: false,
	saving: false,
	dirty: false,
	modalVisible: false,
	sections: rtsbParams.sections,
	section: false,
	data: {
		block_id: false,
		section_id: localStorage.getItem( 'rtsb_selected_section_nav' ) ? localStorage.getItem( 'rtsb_selected_section_nav' ) : 'general',
		options: {},
	},
};



const reducer = ( state, action ) => {
	switch ( action.type ) {
		case UPDATE_STATE_ITEM:
			return {
				...state,
				...action.value,
			};
		case UPDATE_SECTIONS:
			return {
				...state,
				sections: action.sections,
			};
		case UPDATE_DATA_ITEM:
			return {
				...state,
				data: {
					...state.data,
					[ action.id ]: action.value,
				},
			};
		case UPDATE_DATA_BLOCK_ID_ACTION:
			if ( ! action.id || ! state.data.section_id ) {
				return state;
			}

			const options_ = JSON.parse( JSON.stringify( state.data.options ) );
			options_.active = action.value;
			const sections_ = JSON.parse( JSON.stringify( state.sections ) );
			sections_[ state.data.section_id ].list[ action.id ].active =
                action.value;
			return {
				...state,
				callSave: true,
				dirty: true,
				sections: sections_,
				data: {
					...state.data,
					block_id: action.id,
					options: options_,
				},
			};
		case UPDATE_DATA_OPTIONS:
			if ( ! state.data.block_id || ! state.data.section_id ) {
				return state;
			}

			const options = JSON.parse( JSON.stringify( state.data.options ) );
			options[action.id] = action.value;
			const sections = JSON.parse( JSON.stringify( state.sections ) );
			if ( action.id === 'active' ) {
				sections[ state.data.section_id ].list[
					state.data.block_id
				].active = action.value;
			} else {
				const isRepeater = 'repeater' === action?.fieldType;
				const isRemove = 'remove' === action?.doAction;
				if ( isRepeater ) {
					const repeaterData = typeof action?.repeaterData === 'object' ? action?.repeaterData : [];
					const fieldValues = repeaterData.map( ( item ) => {
						const values = {};
						Object.keys( item ).forEach( ( key ) => {
							values[ key ] = item[ key ].value;
						} );
						return values;
					} );

					let oldValue = sections[ state.data.section_id ].list[ state.data.block_id ].fields[ action.parentId ].value;
					// console.log( sections[ state.data.section_id ].list[ state.data.block_id ].fields[ action.parentId ] )
					oldValue = oldValue ? oldValue : {};
					oldValue = 'string' === typeof oldValue ? JSON.parse( oldValue ) : oldValue;

					const oldValueIndex = 'string' === typeof oldValue[ action.index ] ? JSON.parse( oldValue[ action.index ] ) : oldValue[ action.index ];

					const repeat = sections[ state.data.section_id ].list[ state.data.block_id ].fields[ action.parentId ].repeat;

					const repeaterDefaultValue = Object.keys( repeat ).reduce( ( result, key ) => {
						result[ key ] = repeat[ key ].value;
						return result;
					}, {} );

					sections[ state.data.section_id ].list[ state.data.block_id ].fields[ action.parentId ].value = {
						...oldValue,
						[ action.index ]: {
							...repeaterDefaultValue,
							...oldValueIndex,
							[ action.id ]: action.value,
						},
					};

					options[ action.parentId ] = {
						...fieldValues,
						...options[ action.parentId ],
						[ action.index ]: {
							...fieldValues[ action.index ],
							...( options[ action.parentId ]?.[ action.index ] || {} ),
							[ action.id ]: action.value,
						},
					};

					if ( isRemove ) {
						const removeObj = sections[ state.data.section_id ].list[ state.data.block_id ].fields[ action.parentId ].value;
						delete removeObj[ action.index ];
						const obj = {};
						Object.keys( removeObj ).forEach( ( key, newIndx ) => {
							obj[ newIndx ] = removeObj[ key ];
						} );
						sections[ state.data.section_id ].list[ state.data.block_id ].fields[ action.parentId ].value = { ...obj };

						const removeOption = options[ action.parentId ];
						delete removeOption[ action.index ];
						const optionObj = {};
						Object.keys( removeOption ).forEach( ( optionKey, newOptionIndx ) => {
							optionObj[ newOptionIndx ] = removeOption[ optionKey ];
						} );
						options[ action.parentId ] = { ...optionObj };
					}
				} else {
					//options[ action.id ] = action.value;
					sections[ state.data.section_id ].list[state.data.block_id].fields[ action.id ].value = action.value;
				}
			}
			return {
				...state,
				dirty: true,
				sections,
				data: {
					...state.data,
					options,
				},
			};
		default:
			return state;
	}
};

export default reducer;
