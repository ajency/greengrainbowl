import React, { Component } from 'react';
import './App.css';
import './assets/scss/main.scss';
// import { BrowserRouter as Router, Route } from "react-router-dom";
import { HashRouter as Router, Route } from 'react-router-dom';
import Cart from './components/cart/cart.js';
import AddNewAddress from './components/add-new-addess/add-new-address';
import AddressList from './components/address-list/address-list';
import VerifyMobile from './components/verify-mobile/verify-mobile';
import CartCheckoutSummary from './components/cart-checkout-summary/cart-checkout-summary';
import OrderSummary from './components/order-summary/order-summary';
import LogIn from './components/login/login';
import OrderDetails from './components/order-details/order-details.js';
import CouponScreen from './components/coupon-screen/coupon-screen';

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/cart" component={Cart} />
        <Route exact path="/cart/login" component={LogIn} />
        <Route exact path="/cart/select-address" component={AddressList} />
        <Route exact path="/cart/add-address" component={AddNewAddress} />
        <Route exact path="/cart/verify-mobile" component={VerifyMobile} />
        <Route exact path="/cart/cart-summary" component={CartCheckoutSummary}/>
        <Route exact path="/cart/cart-summary/coupons" component={CouponScreen}/>
        <Route exact path="/order-summary/:transaction_id" component={OrderSummary}></Route>
        <Route exact path="/order-details/:order_id" component={OrderDetails} />
      </Router>
    );
  }
}

export default App;