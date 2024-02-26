import React from "react";

import {Layout, Spin} from "antd";
const { Content } = Layout;
import {LoadingOutlined} from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

function Loader() {
    return (
        <Content className="spain-icon" style={{
            height: "90vh",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}> <Spin indicator={antIcon}/></Content>
    );
}

export default Loader;