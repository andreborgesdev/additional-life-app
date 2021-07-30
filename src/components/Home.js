import React, { useState } from "react";
import { Layout, Menu, Breadcrumb, Col, Row, Button } from "antd";
import Product from "./Product";
import sampleProducts from "../sample-products"
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import "../css/Home.css";

const { Header, Content, Footer } = Layout;

function Home() {
    const [products, setProducts] = useState({});

    const loadSampleProducts = () => {
        setProducts(sampleProducts);
    };

     return (
         <Layout className="layout">
             <Header>
                 <div className="logo" />
                 <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                     <Menu.Item key="1">{`nav 1`}</Menu.Item>
                     <Menu.Item key="2">{`nav 2`}</Menu.Item>
                     <Menu.Item key="3">{`nav 3`}</Menu.Item>
                     <Menu.Item key="4">{`nav 4`}</Menu.Item>
                 </Menu>
             </Header>
             <Content style={{ padding: '0 50px' }}>
                 {/*<Breadcrumb style={{ margin: '16px 0' }}>*/}
                 {/*    <Breadcrumb.Item>Home</Breadcrumb.Item>*/}
                 {/*    <Breadcrumb.Item>List</Breadcrumb.Item>*/}
                 {/*    <Breadcrumb.Item>App</Breadcrumb.Item>*/}
                 {/*</Breadcrumb>*/}
                 <div className="site-layout-content">
                     <h1>Most recent additions:</h1>
                     <div className="site-card-wrapper">
                         <Row gutter={[8, 48]}>
                             {Object.keys(products).map(key => (
                                 <Col span={6}>
                                     <Product product={products[key]}  />
                                 </Col>
                             ))}
                             {Object.keys(products).map(key => (
                                 <Col span={6}>
                                     <Product product={products[key]}  />
                                 </Col>
                             ))}
                             {Object.keys(products).map(key => (
                                 <Col span={6}>
                                     <Product product={products[key]}  />
                                 </Col>
                             ))}
                         </Row>
                         <Button style={{ margin: '50px 0px' }} type="primary" shape="round" icon={<SearchOutlined />} size="large">
                             See more
                         </Button>
                     </div>
                     <button style={{ margin: '50px 0px' }} onClick={loadSampleProducts}>Load sample products</button>
                 </div>
             </Content>
             <Footer style={{ textAlign: 'center' }}>Made with love in CH</Footer>
         </Layout>
     );
}

export default Home;