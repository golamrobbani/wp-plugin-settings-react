/* global rtsbParams */

import * as Types from "./actionType";

export const initialState = {
	saveType: null,
	options: {
		isLoading: true,
	},
	generalData:{
		isLoading: true,
		selectedMenu: localStorage.getItem("current_menu") || 'settings',
	},
};

const reducer = (state, action) => {
	switch (action.type) {
		case Types.UPDATE_OPTIONS:
			return {
				...state,
				saveType: action.saveType,
				options: action.options,
			};
		case Types.GENERAL_DATA:
			return {
				...state,
				generalData : action.generalData,
			};
		default:
			return state;
	}
};

export default reducer;

