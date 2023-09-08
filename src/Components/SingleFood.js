import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { CartProvider } from "./AllContext/CartContext";
import "../App.css";

const SingleFood = () => {
  const { viewDetails } = useParams();
  const [food, setFood] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [cartData, setCartData] = useContext(CartProvider);
  const [successMsg, setSuccessMsg] = useState(false);
  const [canOrder, setCanOrder] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/getSingleFood?singleFoodId=${viewDetails}`
        );
        const data = await response.json();
        setFood(data);
      } catch (error) {
        console.log("err", error);
      }
    };
    fetchFood();
  }, [viewDetails]);

  const handleChange = (event) => {
    setSelectedSize(event.target.value);
  };

  //add to refresh off
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  //addons/ exters
  const handleExtraChange = (event) => {
    const selectedExtra = event.target.value;
    const isChecked = event.target.checked;

    const [addonName, addonPrice] = selectedExtra.split(",");

    if (isChecked) {
      setSelectedExtras((prevSelected) => [
        ...prevSelected,
        { nameOfAddon: addonName, priceOfAddon: parseInt(addonPrice) },
      ]);
    } else {
      setSelectedExtras((prevSelected) =>
        prevSelected.filter((extra) => extra.nameOfAddon !== addonName)
      );
    }
  };

  //handleDecrese
  const handleDecrease = () => {
    setQuantity(Math.max(quantity - 1, 1));
  };

  //handleIncrease
  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  //hande add to cart system
  const addToCart = () => {
    // matching the size's-price according to selected size
    const selectedFoodPrice = food.map(
      (data) =>
        data?.sizePriceItem?.find((v) => v?.size === selectedSize)?.price || 0
    );

    //item object
    const item = {
      id: food[0]._id,
      image: food[0].image,
      name: food[0].name,
      size: selectedSize,
      price: parseInt(selectedFoodPrice),
      foodCode: food[0].foodCode,
      extras: selectedExtras,
      stock: food[0].stock,
      quantity: quantity,
    };

    // get existing cart items from local storage
    let cart = JSON.parse(localStorage.getItem("foodCart")) || [];

    // find the existing item index if the item already exists in the cart
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex !== -1) {
      // if the item already exists, update the quantity instead of adding a new item when press the add button
      cart[existingItemIndex].quantity = quantity;
      cart[existingItemIndex].extras = selectedExtras;
      cart[existingItemIndex].size = selectedSize;
      cart[existingItemIndex].price = parseInt(selectedFoodPrice);
    } else {
      // if the item is new, add it to the cartItems array
      cart.push(item);
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
      }, 5000);
    }

    // update the cart data in the context
    setCartData(cart);
  };

  //cartItem remove
  const handleClearCart = (id) => {
    let newData = cartData.filter((item) => item.id !== id);
    setCartData(newData);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Order Timing 11am - 9pm
  useEffect(() => {
    const checkOrderAvailability = () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();

      const startHour = 0;
      const endHour = 12;

      if (currentHour >= startHour && currentHour < endHour) {
        setCanOrder(true);
      } else {
        setCanOrder(false);
      }
    };

    checkOrderAvailability();

    // const interval = setInterval(() => {
    //   checkOrderAvailability();
    // }, 60000);
    const interval = setInterval(checkOrderAvailability, 60000);

    checkOrderAvailability(); // Initial call to check availability

    return () => clearInterval(interval);
  }, []);

  const handleCheckoutPageGo = () => {
    history.push("/checkout");
  };

  return (
    <>
      <section className="container singleProduct_main">
        {food.map((data) => (
          <div key={data._id} className="single_product_body">
            <aside className="single_product_img">
              <img
                src="https://i.ibb.co/vDzBjrC/giphy.gif"
                alt="food"
                loading="lazy"
              />
            </aside>
            <aside className="single_product_details">
              <p>{data.foodCode}</p>
              <h1 className="single_product_name">{data.name}</h1>
              <p className="single_product_description">
                {data.foodDescription}
              </p>
              <p className="single_product_price my-3">
                {data.sizePriceItem.map((sizePrice, index) => (
                  <span key={index}>
                    <span>{sizePrice.price} Tk</span>
                  </span>
                ))}
              </p>
              <form onSubmit={handleSubmit}>
                {selectedSize && (
                  <h1>
                    {
                      data.sizePriceItem.find((v) => v.size === selectedSize)
                        .price
                    }
                    Tk
                  </h1>
                )}
                <select
                  name=""
                  id="food"
                  className="single_product_select_option mt-4"
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose Size</option>
                  {data.sizePriceItem.map((variant) => (
                    <option key={variant.size} value={variant.size}>
                      {variant.size}
                    </option>
                  ))}
                </select>
                <div className="addons_checkbox my-5">
                  <h6>Extra Items</h6>
                  {data?.addonsItem?.map((addon, index) => {
                    if (!addon.addonName || !addon.addonPrice) {
                      return <div key={index}></div>;
                    }
                    return (
                      <>
                        <div
                          key={index}
                          className="form-check form-check-inline"
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`inlineCheckbox${index}`}
                            value={`${addon.addonName},${addon.addonPrice}`}
                            onChange={handleExtraChange}
                            checked={selectedExtras.some(
                              (extra) => extra.nameOfAddon === addon.addonName
                            )}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`inlineCheckbox${index}`}
                          >
                            {addon.addonName} ({addon.addonPrice} Tk.)
                          </label>
                        </div>
                      </>
                    );
                  })}
                </div>
                {data?.stock === "Stock_In" ? (
                  <>
                    <div className="quantity_cart_button my-3">
                      <span className="quantity_cart_input">
                        <button
                          className="value-button"
                          id="decrease"
                          onClick={() => handleDecrease()}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          id="number"
                          value={quantity}
                          readOnly
                        />
                        <button
                          className="value-button"
                          id="increase"
                          onClick={() => handleIncrease()}
                        >
                          +
                        </button>
                      </span>
                      <button
                        // onClick={addToCart}
                        className="MyBtn add_to_cart_button"
                        style={{
                          width: "600px",
                          fontWeight: "bold",
                        }}
                        type="submit"
                        onClick={selectedSize ? addToCart : null}
                      >
                        <i className="bi bi-cart-plus-fill"></i> Add To Cart/
                        set localStroage
                      </button>
                    </div>
                    <div className="quantity_cart_button my-3">
                      <button
                        className="MyBtn add_to_cart_button"
                        onClick={() => handleClearCart(data?._id)}
                      >
                        <i className="bi bi-x-circle"></i> Clear Cart
                      </button>

                      <button onClick={() => handleCheckoutPageGo()}>
                        <i className="bi bi-cart-fill"></i> go to the Checkout
                        page
                      </button>
                    </div>
                    <p>
                      1st press the add to card then press the checkotu page
                    </p>
                  </>
                ) : (
                  <h3 style={{ color: "red" }}>
                    Stock out , or can not be served in the online right now..!
                  </h3>
                )}
              </form>
              <p className="my-3 categories_link my-4">
                Categories:{" "}
                <Link to="/" className="myLinks">
                  {data.categories}
                </Link>{" "}
                <i className="bi bi-chevron-right"></i>{" "}
                <Link to="/" className="myLinks">
                  {data.subCategories}
                </Link>
              </p>
            </aside>
          </div>
        ))}
      </section>
    </>
  );
};

export default SingleFood;
