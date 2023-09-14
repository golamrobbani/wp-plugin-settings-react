import React from 'react';

import { useStateValue } from '../Utils/StateProvider';

import Loader from '../Utils/Loader';

import {
    Form,
    Layout,
    Button,
    Input,
    Divider,
    Typography
} from 'antd';

const { TextArea } = Input;

const { Content } = Layout;

const { Title, Text } = Typography;

import * as Types from "../Utils/actionType";

function Settings() {

    const [stateValue, dispatch] = useStateValue();

    return (
        <Layout style={{ position: 'relative' }}>
            <Form
                labelCol={{
                    span: 5,
                    offset: 0,
                    style:{
                        textAlign: 'left',
                    }
                }}
                wrapperCol={{ span: 12 }}
                layout="horizontal"
                style={{
                    maxWidth: 900,
                    padding: '15px',
                    height: '100%'
                }}
            >

                { stateValue.options.isLoading ? <Loader/> :
                    <Content style={{
                        padding: '15px',
                        background: 'rgb(255 255 255 / 35%)',
                        borderRadius: '5px',
                        boxShadow: 'rgb(0 0 0 / 1%) 0px 0 20px',
                    }}>
                        <>
                            <Divider />
                            <TextArea
                                type="primary"
                                size="large"
                                onChange={
                                    (event) => dispatch({
                                        type: Types.UPDATE_OPTIONS,
                                        options : {
                                            ...stateValue.options,
                                            default_demo_text: event.target.value,
                                        }
                                    })
                                }
                                value={stateValue.options.default_demo_text}
                            />
                            <Text
                                type="secondary"
                            >
                                This is example field
                            </Text>
                        </>

                    </Content>
                }

            </Form>
            <Button
                type="primary"
                size="large"
                style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '100px'
                }}
                onClick={ () => dispatch({
                    ...stateValue,
                    type: Types.UPDATE_OPTIONS,
                    saveType: Types.UPDATE_OPTIONS,
                }) } >
                Save Settings
            </Button>
        </Layout>

    );
};

export default Settings;