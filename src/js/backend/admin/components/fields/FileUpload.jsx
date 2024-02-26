import React, {useState, useEffect } from 'react';
import {Upload, Modal, Button, message, notification, ColorPicker} from 'antd';
// import axios from 'axios';
import {LoadingOutlined, PlusOutlined, EyeOutlined, DeleteOutlined} from '@ant-design/icons';
import {useStateValue} from "../../utils/StateProvider";
import {UPDATE_DATA_OPTIONS} from "../../utils/actionType";
import FieldLabel from "./FieldLabel";

const FileUpload = (props) => {

    const {help, value} = props.field;
    const id = props.id;
    const [data, dispatch] = useStateValue();

    const fieldType = props.field?.fieldType;
    const parentId = props.field?.parentId;
    const index = props.field?.index;
    const repeaterData = props.field?.repeaterData;

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const [loading, setLoading] = useState(false);

    const [imageData, setImageData] = useState(null );

    const handleCancel = () => setPreviewVisible(false);

    const handleFileChange = async (file) => {
        setLoading( true )
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(`${rtsbParams.restApiUrl}wp/v2/media`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-WP-Nonce': rtsbParams.rest_nonce
                    // Note: 'multipart/form-data' is automatically set when using FormData, no need to specify it
                },
            });
            // Check if the request was successful (status code in the range of 200-299)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse the response body as JSON (assuming the server returns JSON data)
            const responseData = await response.json();

            // Handle the response here, if needed

            notification.success({
                message: 'File uploaded successfully!.',
            });

            dispatch({
                type: UPDATE_DATA_OPTIONS,
                id,
                value: {
                    id: responseData.id,
                    source: responseData.source_url
                },
                fieldType,
                parentId,
                repeaterData,
                index
            });
            setImageData( {
                id: responseData.id,
                source: responseData.source_url
            } );
        } catch (error) {
            // Handle the error here
            console.error(error);
            message.error('File upload failed.');
            setImageData( null  );

        }
    };

    const customRequest = ({file, onSuccess, onError}) => {
        setTimeout(() => {
            handleFileChange(file)
                .then(() => onSuccess('ok'))
                .catch((err) => {
                    console.error(err);
                    onError(err);
                });
        }, 0);
    };

    const handlePreview = async () => {
        setPreviewImage(imageData?.source);
        setPreviewVisible(true);
    };

    const handleDelete = async () => {
        setImageData(  null  );
        setLoading( true )
        // Check if the image data exists
        if (!imageData) {
            return;
        }

        try {
            const response = await fetch(`${rtsbParams.restApiUrl}wp/v2/media/${imageData.id}?force=True`, {
                method: 'DELETE',
                headers: {
                    'X-WP-Nonce': rtsbParams.rest_nonce
                },
            });
            // Check if the request was successful (status code in the range of 200-299)
            if (response.ok) {
                // Reset the image data and update the state
                await dispatch({
                    type: UPDATE_DATA_OPTIONS,
                    id,
                    value: null,
                    fieldType,
                    parentId,
                    repeaterData,
                    index
                });

                // Deletion successful
                await notification.success({
                    message: 'File deleted successfully!',
                });

            } else {
                // Deletion failed
                throw new Error('Network response was not ok');
            }
            setImageData(  null  );
        } catch (error) {
            // Handle the error here
            console.error(error);
            message.error('File deletion failed.');
            setImageData(  null  );
        }
        setLoading( false )
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    const setImageDataToItem = () => {
        setImageData(  'object' == typeof value || ! value ? value : JSON.parse(value.replace(/\\/g, '')) );
    };

    useEffect( () => {
        setImageDataToItem();
    }, [] );

    return (
        <div className="rtsb-field text">
            <FieldLabel field={props.field}/>
            <div className="rtsb-field__content">
                <div className="rtsb-field-control">
                    <div className="rtsb-field-upload-wrapper"
                         style={{
                             position: 'relative',
                             display: 'inline-flex',
                             alignItems: 'center',
                             justifyContent: 'center'
                         }}
                    >
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className={`rtsb-avatar-uploader ${ imageData?.source ?  'rtsb-avatar-uploaded' : 'rtsb-avatar-deleted' } ` }
                            customRequest={customRequest}
                            onPreview={handlePreview}
                        >
                            { imageData?.source ? <img src={imageData?.source} alt="avatar" style={{width: '100%'}}/> : uploadButton }
                        </Upload>

                        { imageData?.source ? (
                            <>
                                <div className="image-preview-overlay" >
                                    <EyeOutlined className="preview-icon" onClick={() => handlePreview()}/>
                                    <DeleteOutlined className="delete-icon" onClick={handleDelete}/>
                                </div>
                            </>
                        ) : null}
                    </div>
                    {/* Modal for preview */}
                    <Modal
                        open={previewVisible}
                        title="Image Preview"
                        footer={null}
                        className="rtsb-image-preview-modal"
                        bodyStyle={{
                            padding: '15px',
                        }}
                        onCancel={handleCancel}
                    >
                        <img alt="Preview" style={{width: '100%'}} src={previewImage}/>
                    </Modal>
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

export default FileUpload;
