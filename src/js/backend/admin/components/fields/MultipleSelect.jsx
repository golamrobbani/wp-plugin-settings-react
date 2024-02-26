import {useStateValue} from '../../utils/StateProvider';
import {UPDATE_DATA_OPTIONS, UPDATE_STATE_ITEM} from '../../utils/actionType';
import FieldLabel from './FieldLabel';

const {Option} = Select;
import React, {useMemo, useRef, useState, useEffect} from 'react';

import {notification, Select, Spin} from 'antd';
import {rtsbDebounce} from "../../utils/helper";

function DebounceSelect({fetchOptions, initialOptions = [], debounceTimeout = 400, ...props}) {

    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState(initialOptions);
    const fetchRef = useRef(0);
    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);
            fetchOptions(value).then((newData) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }
                setOptions(newData); // Update options
                setFetching(false);
            });
        };
        return rtsbDebounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);
    return (
        <Select
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small"/> : null}
            {...props}
        >
            {options.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                    {option.label}
                </Select.Option>
            ))}
        </Select>
    );
}

// Usage of DebounceSelect

async function fetchDropdownList( field , val ) {

    const params = new URLSearchParams();
    params.append('action', 'rtsb_get_multiselect_data'); // Add existing parameter
    params.append('__rtsb_wpnonce', rtsbParams.nonce );

    if( field?.func_with_param ){
        params.append('func_with_param', JSON.stringify( field?.func_with_param ) ); // Add new parameter
    }
    if( val ){
        params.append('s', val ); // Add new parameter
    }
    // Construct the URL with the query parameters
    const url = `${rtsbParams.ajaxurl}?${params.toString()}`;
    return fetch(url)
        .then((response) => response.json())
        .then((body) => {
            return body.data.map((item) => ({
                label: item.label,
                value: item.value,
            }));
        } );
}

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const MultipleSelect = (props) => {
    const {id, field} = props;
    const {value, help, options, empty, searchable, placeholder} = field;
    const fieldType = props.field?.fieldType;
    const parentId = props.field?.parentId;
    const index = props.field?.index;
    const repeaterData = props.field?.repeaterData;

    const [data, dispatch] = useStateValue();

    const defaultValue = ! value ? [] : value ;

    const parsedObjects = defaultValue.map( item => 'object' !== typeof item ? JSON.parse( item ) : item );

    const opt = parsedObjects.concat( options ); // { ...options, ...parsedObjects };
    // Create a Set to store unique values
    const uniqueValues = new Set();

    // Filter out duplicate objects based on the 'value' property
    const uniqueOpt = opt.filter(item => {
        if (!uniqueValues.has(item.value)) {
            uniqueValues.add(item.value);
            return true;
        }
        return false;
    });


    return (
        <div className="rtsb-field select">
            <FieldLabel field={props.field}/>
            <div className="rtsb-field__content">
                <div className="rtsb-field-control">
                    <DebounceSelect
                        mode="multiple"
                        value={parsedObjects}
                        placeholder={placeholder}
                        initialOptions={ uniqueOpt }
                        fetchOptions={(val) => fetchDropdownList(field, val)}
                        onChange={(newValues, newOptions ) => {
                            const theValue = newOptions.map( option => {
                                return {
                                    value : option.value,
                                    label : option.children
                                };
                            });
                            dispatch({
                                type: UPDATE_DATA_OPTIONS,
                                id,
                                value: theValue,
                                fieldType,
                                parentId,
                                repeaterData,
                                index,
                            });
                        }}
                        style={{
                            width: '100%',
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
export default MultipleSelect;