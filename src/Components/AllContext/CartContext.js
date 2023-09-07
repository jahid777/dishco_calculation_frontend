import React, { createContext, useEffect, useMemo, useState } from "react";

export const CartProvider = createContext();

// get cart-data from localStorage
const getLocalStorageCartData = () => {
  let cartData;
  if (typeof window !== "undefined") {
    const localData = JSON.parse(localStorage.getItem("foodCart")) || [];
    cartData = localData;
  }
  return cartData;
};

const CartContext = ({ children }) => {
  const [cartData, setCartData] = useState(getLocalStorageCartData());

  // save cart-data to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("foodCart", JSON.stringify(cartData || []));
    }
  }, [cartData]);

  //calculation of total addon price in the cart
  const finaltotalAddonPrice = useMemo(() => {
    return cartData.reduce((accumulator, cartDt) => {
      const addonsPrice = cartDt?.extras?.reduce((accumulator, addon) => {
        return accumulator + addon.priceOfAddon;
      }, 0);
      return accumulator + addonsPrice;
    }, 0);
  }, [cartData]);

  //calculation of total  price in the cart
  const subTotalPrice = useMemo(() => {
    return cartData.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }, [cartData]);

  return (
    <div>
      <CartProvider.Provider
        value={[cartData, setCartData, finaltotalAddonPrice, subTotalPrice]}
      >
        {children}
      </CartProvider.Provider>
    </div>
  );
};

export default CartContext;
