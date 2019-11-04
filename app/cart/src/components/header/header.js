import React, { Component } from 'react';
import './header.scss';
import logo from '../../assets/images/NewLogo.png';
import logoCheckout from '../../assets/images/checkout.png';
import closeIcon from '../../assets/images/remove.png';

class Header extends Component {
	render() {
		return (
			<div className="header-container d-flex align-items-center background-offgreen">
				<div className="app-name d-flex align-items-center">					
					<img src={logo} className="app-log" alt="Green Grain Bowl" title="Green Grain Bowl"/>
				</div>
				<div className="app-chekout text-green">
					<img src={logoCheckout} className="app-log" alt="Green Grain Bowl" title="Green Grain Bowl"/>
					Secure <br/>Checkout
				</div>
				<h3 className="app-close m-0 text-white btn-pay m-0" onClick={() => this.closeCart()}>
					<span aria-hidden="true"><img src={closeIcon} className="app-log" alt="Green Grain Bowl" title="Green Grain Bowl"/></span>
				</h3>
			</div>
		);
	}

	closeCart(){
		document.querySelector(".cart-wrapper").classList.remove('active');
		let url = window.location.href.split("#")[0];
		window.history.replaceState({cart : false}, 'cart', url);
		window.removeBackDrop();
	}
}

export default Header;