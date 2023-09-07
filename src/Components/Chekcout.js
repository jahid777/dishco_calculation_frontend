import React, { useContext, useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Link } from "react-router-dom";

import axios from "axios";
import { CartProvider } from "./AllContext/CartContext";
import "../App.css";

const Checkout = () => {
  const cityRef = useRef();
  const addressRef = useRef();
  const phoneNumberRef = useRef();
  const emailRef = useRef();
  const extra_informationRef = useRef();
  const PaymentRef = useRef();
  const history = useHistory();
  const [paymnetLoading, setPaymentLoading] = useState(false);
  const [cartData, setCartData, finaltotalAddonPrice, subTotalPrice] =
    useContext(CartProvider);
  const [termCondition, setTermCondition] = useState(false);
  const [grandTotal, setGrandTotal] = useState(0);

  console.log(cartData);

  //calculation of grand total
  useEffect(() => {
    setGrandTotal(Number(finaltotalAddonPrice) + Number(subTotalPrice));
  }, []);

  // const grandTotal = Number(finaltotalAddonPrice) + Number(subTotalPrice) + 80;

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    const confirmOderData = {
      total_amount: grandTotal,
      orderedData: cartData,
      cus_city: cityRef?.current.value,
      extra_information: extra_informationRef?.current.value,
      cus_phone: phoneNumberRef.current.value,
      cus_add1: addressRef.current.value,
      product_status: "Pending",
      payment_method: PaymentRef.current.value,
      orderTime: Date(),
    };

    //cartItem remove
    const handleClearCart = (id) => {
      localStorage.removeItem("foodCart");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    };

    //conditionally check the payment and hit the api

    fetch(`${process.env.REACT_APP_BACKEND_URL}/cashonDeliveryInit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(confirmOderData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setPaymentLoading(false);
        console.log(data);
        // history.push("/products");
        handleClearCart();
      })
      .catch((error) => {
        console.error("Error:", error);
        setPaymentLoading(false);
        // Handle the error gracefully, e.g., display an error message to the user.
      });
  };

  return (
    <>
      <section className="container-fluid checkout_main">
        <span>
          <h2 className="text-center">Checkout</h2>
          <img
            src="https://res.cloudinary.com/dnz6zg4on/image/upload/v1692872250/Frontend_images/joh2ojg6s3gwwmqh3st0.png"
            alt=""
            className="img-fluid checkout-patterns-bottom"
          />
        </span>

        <form className="checkout_body" onSubmit={handleConfirmOrder}>
          <aside className="billing_form">
            <h5>Shipping Address</h5>
            <div className="mb-3">
              <label htmlFor="inputName" className="form-label mandatory_field">
                Your name
              </label>
              <input
                type="text"
                className="form-control checkout-page-input"
                id="inputName"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="area" className="form-label mandatory_field">
                Area
              </label>
              <select
                className="form-select checkout-page-input"
                aria-label="Default select example"
                ref={cityRef}
                required
              >
                <option value="">Select Your Area</option>
                <option value="Azimpur">Azimpur</option>
                <option value="Chankharpul">Chankharpul</option>
                <option value="Dhanmondi">Dhanmondi</option>
                <option value="Dhaka University Hall">
                  Dhaka University Hall
                </option>
                <option value="Darussalam">Darussalam</option>
                <option value="Elephent Road">Elephent Road</option>
                <option value="Farmgate">Farmgate</option>
                <option value="Green Road">Green Road</option>
                <option value="Kola Bagan">Kola Bagan</option>
                <option value="Kamrangirchar">Kamrangirchar</option>
                <option value="Kallyanpur">Kallyanpur</option>
                <option value="Mohammadpur Bus Stand">
                  Mohammadpur Bus Stand
                </option>
                <option value="Mohammadpur beribadh">
                  Mohammadpur beribadh
                </option>
                <option value="Mohammadpur Adabor">Mohammadpur Adabor</option>
                <option value="Mohammadpur Asad Gate">
                  Mohammadpur Asad Gate
                </option>
                <option value="New Market, Dhaka">New Market, Dhaka</option>
                <option value="Nakhalpara West Tejgaon">
                  Nakhalpara West Tejgaon
                </option>
                <option value="Nakhalpara south">Nakhalpara south</option>
                <option value="Shahbag">Shahbag</option>
                <option value="Shyamoli-1">Shyamoli-1</option>
                <option value="Shyamoli-2">Shyamoli-2</option>
                <option value="Panthopath Chattor">Panthopath Chattor</option>
                <option value="Polashi">Polashi</option>
                <option value="Puran Dhaka(Bangshal)">
                  Puran Dhaka(Bangshal)
                </option>
                <option value="Puran Dhaka (Dholaikhal)">
                  Puran Dhaka (Dholaikhal)
                </option>
                <option value="Rayer Bazaar">Rayer Bazaar</option>
              </select>
            </div>
            <div className="mb-3">
              <label
                htmlFor="inputAddress"
                className="form-label mandatory_field"
              >
                Details Address
              </label>
              <input
                ref={addressRef}
                type="text"
                className="form-control checkout-page-input"
                id="inputAddress"
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="inputContact"
                className="form-label mandatory_field"
              >
                Contact Number
              </label>
              <input
                ref={phoneNumberRef}
                type="phone"
                className="form-control checkout-page-input"
                id="inputContact"
                required
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="inputEmail"
                className="form-label mandatory_field"
              >
                Email
              </label>
              <input
                ref={emailRef}
                type="email"
                className="form-control checkout-page-input"
                id="inputEmail"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="extraInfo" className="form-label">
                Order Note(Optional)
              </label>
              <textarea
                ref={extra_informationRef}
                className="form-control checkout-page-input"
                id="extraInfo"
                rows="3"
              ></textarea>
            </div>

            <div className="mandatory_note">
              Note: Start(*) Marks Fields are Mandatory.
            </div>
          </aside>
          <aside className="checkout_details">
            <h5 className="mb-5">Your Order</h5>
            <div className="table_row">
              <strong>Items</strong>
              <strong>Subtotal</strong>
            </div>

            <div className="table_row subtotal">
              <strong>Total Food Price</strong>
              <span>{subTotalPrice} Tk.</span>
            </div>

            <div className="table_row shipping">
              <strong>Total Extra Item Price</strong>
              <span>{finaltotalAddonPrice} tk.</span>
            </div>

            <div className="table_row total">
              <strong>Total</strong>
              <span>
                {/* {cartData.length && finaltotalAddonPrice + subTotalPrice + 80} */}
                {grandTotal}
                Tk.
              </span>
            </div>
            <select
              className="form-select checkout-page-input"
              aria-label="Default select example"
              ref={PaymentRef}
              required
            >
              <option value="">Select Payment Methods</option>
              <option value="Cash on delivery">Cash on delivery</option>
            </select>
            <p className="my-5 TandC_text">
              <span className="cash-On-delivery-text">
                <b>* Cash on delivery:</b> Pay with cash upon delivery.
              </span>
              <br />
              Your personal data(name and email address) will be used to process
              your order, support your experience throughout this website, and
              for other purposes described in our{" "}
              <Link to="/privacy-policy" className="myLinks TandC_link">
                Privacy Policy
              </Link>{" "}
              .
            </p>

            <div className="mb-3 form-check checkBox_main">
              <input
                type="checkbox"
                className="form-check-input checkBox_input"
                id="exampleCheck1"
                onChange={() => setTermCondition(!termCondition)}
              />
              <label
                className="form-check-label checkBox_label"
                htmlFor="exampleCheck1"
              >
                I have read and agree to the website{" "}
                <Link to="/" className="myLinks TandC_link">
                  Terms and Conditions
                </Link>
                *
              </label>
            </div>
            <button
              type="submit"
              className="btn MyBtn placeOrder_btn"
              disabled={!termCondition || cartData.length === 0}
            >
              {paymnetLoading ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                "Confirm Order"
              )}
            </button>
          </aside>
        </form>
      </section>
    </>
  );
};

export default Checkout;
