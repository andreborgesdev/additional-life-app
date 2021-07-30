import React from "react";
import { Card } from 'antd';
import "../css/Product.css";

const { Meta } = Card;

function Product(props) {
    const { name, description, location, image } = props.product;

    return (
        <Card
            hoverable
            cover={<img alt={name} src={image} className="productCard-img" />}
            className="productCard-main-card"
        >
            <Meta title={name} description={description} />
            <Meta description={location} />
        </Card>
    )
}

export default Product;