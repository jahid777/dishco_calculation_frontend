import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "../App.css";
import { Link } from "react-router-dom";

const Products = () => {
  const [food, setFood] = useState([]);
  useEffect(() => {
    const fetchAllFood = () => {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/getAllProducts`)
        .then((response) => setFood(response?.data))
        .catch((error) => console.log(error));
    };
    fetchAllFood();
  }, []);
  return (
    <>
      <section className="displayProduct_main">
        <div className="container my-5">
          <div className="product_card_row">
            {food.length === 0 && (
              <div className="loading_spinner">
                <h1>loading</h1>
              </div>
            )}
            {food.map((data, index) => (
              <div key={index}>
                <div className="product_card_body">
                  <img
                    src="https://i.ibb.co/vDzBjrC/giphy.gif"
                    alt=""
                    className="product_img"
                    loading="lazy"
                  />
                  <h6 className="product_name">{data.name.slice(0, 29)}</h6>
                  <p className="product_price">
                    {data.sizePriceItem.map((sizePrice, index2) => (
                      <span key={index2}>
                        <span className="price_span">{sizePrice?.price}</span>
                      </span>
                    ))}
                  </p>

                  <span>
                    <Link
                      to={`/singleFood/${data?._id}`}
                      className="btn MyBtn product_button"
                    >
                      <button className="btn btn-primary">
                        {" "}
                        View Details <i className="bi bi-eye"></i>
                      </button>
                    </Link>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;
