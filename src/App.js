import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Chekcout from "./Components/Chekcout";
import SingleFood from "./Components/SingleFood";
import AddFood from "./Components/AddFood";
import CartContext from "./Components/AllContext/CartContext";
import Products from "./Components/Products";

const App = () => {
  return (
    <>
      <CartContext>
        <Router>
          <Switch>
            <Route exact path="/">
              <Products />
            </Route>

            <Route exact path="/singleFood/:viewDetails">
              <SingleFood />
            </Route>

            <Route exact path="/checkout">
              <Chekcout />
            </Route>

            <Route exact path="/addFood">
              <AddFood />
            </Route>
          </Switch>
        </Router>
      </CartContext>
    </>
  );
};

export default App;
