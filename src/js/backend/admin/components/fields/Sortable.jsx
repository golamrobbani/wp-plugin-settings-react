import { useStateValue } from '../../utils/StateProvider';
import {
	SortableContainer,
	SortableElement,
	sortableHandle,
} from 'react-sortable-hoc';
import FieldLabel from './FieldLabel';
import { useEffect, useState } from 'react';
import _ from 'lodash/fp';
import { arrayMoveImmutable } from 'array-move';

import { UPDATE_DATA_OPTIONS } from '../../utils/actionType';

const DragHandle = sortableHandle(() => <span className="handler">::</span>);
const SortableItem = SortableElement(({ storedData, label, id, field }) => {
	const [data, dispatch] = useStateValue();
	return (
		<li className="rtsb-sortable-item">
			<DragHandle />
			<label htmlFor={`sortable-item-${id}`}>
				<input
					checked={_.isArray(field.value) && field.value.includes(id)}
					id={`sortable-item-${id}`}
					type="checkbox"
					onChange={(e) => {
						let fields = [...field.value];
						if (e.target.checked) {
							fields.push(id);
						} else {
							fields = fields.filter((item) => item !== id);
						}
						dispatch({
							type: UPDATE_DATA_OPTIONS,
							id: field.id,
							value: fields,
						});
					}}
					value={id}
				/>
				{label}
			</label>
		</li>
	);
});

const SortableList = SortableContainer(({ items, field }) => {
	return (
		<ul className="rtsb-sortable-wrap">
			{Object.keys(items).map((key, index) => (
				<SortableItem
					key={`item-${key}`}
					field={field}
					index={index}
					id={key}
					label={items[key]}
				/>
			))}
		</ul>
	);
});

const Sortable = (props) => {
	const { options, value, id } = props.field;
	const [items, setItems] = useState(options);
	const [data, dispatch] = useStateValue();

	useEffect(() => {
		const oldOptions = { ...options };
		let newOptions = {};
		if (value.length) {
			value.map((_) => {
				newOptions[_] = oldOptions[_];
				delete oldOptions[_];
			});
		}
		newOptions = { ...newOptions, ...oldOptions };
		setItems(newOptions);
		return () => {};
	}, []);

	const onSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex === newIndex) return;
		const oldItemsArr = Object.keys(items);
		const newItemArr = arrayMoveImmutable(oldItemsArr, oldIndex, newIndex);
		const newItems = {};
		newItemArr.map((_) => {
			newItems[_] = items[_];
		});
		const fields = Object.keys(newItems).filter((item) =>
			value.includes(item)
		);
		dispatch({
			type: UPDATE_DATA_OPTIONS,
			id: id,
			value: fields,
		});
		setItems(newItems);
	};
	return (
		<div className="rtsb-field sortable">
			<FieldLabel field={props.field} />
			<div className="rtsb-field__content">
				<SortableList
					lockAxis="y"
					helperClass="draggable-item"
					field={props.field}
					items={items}
					onSortEnd={onSortEnd}
				/>
			</div>
		</div>
	);
};

export default Sortable;
