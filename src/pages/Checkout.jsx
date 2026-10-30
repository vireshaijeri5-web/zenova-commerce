import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { clearCart, selectCartItems, selectCartSubtotal } from "../features/cart/cartSlice";
import { clearOffer, selectOfferDiscount } from "../features/offers/offerSlice";
import { formatPrice } from "../components/products/ProductCard";
import EmptyState from "../components/common/EmptyState";
import PromoCode from "../components/checkout/PromoCode";

export default function Checkout() {
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const discount = useSelector(selectOfferDiscount);
  const total = subtotal - discount;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!items.length) return <section className="page-section container"><EmptyState title="Your bag is empty." text="Add a few favourites before checking out." /></section>;

  function submit(event) {
    event.preventDefault();
    const orderNumber = `ZENOVA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const savedDiscount = discount;
    dispatch(clearCart());
    dispatch(clearOffer());
    navigate("/order-confirmation", { state: { name, email, orderNumber, discount: savedDiscount, total } });
  }

  return <section className="page-section container"><Link to="/cart" className="back-link"><ArrowLeft size={16} /> Back to your bag</Link><div className="page-intro checkout-intro"><span className="eyebrow">One last step</span><h1>Checkout, <em>demo style.</em></h1><p>This is a frontend-only flow. No payment details or real order are collected.</p></div>
    <div className="cart-layout checkout-layout"><form className="auth-form checkout-form" onSubmit={submit}><div className="demo-notice"><ShieldCheck size={18} /><span><strong>Demo checkout</strong><br />We only use your name and email to show a local confirmation on this device. Nothing is sent to a server.</span></div><label htmlFor="checkout-name">Name</label><input id="checkout-name" value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" /><label htmlFor="checkout-email">Email address</label><input id="checkout-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /><button className="button button--primary" type="submit">Place demo order · {formatPrice(total)}</button></form>
      <aside className="checkout-summary"><span className="eyebrow">Your edit</span><h2>Order summary</h2>{items.map((item) => <div className="summary-row" key={item.id}><span>{item.title} × {item.quantity}</span><strong>{formatPrice(item.price * item.quantity)}</strong></div>)}<PromoCode />{discount > 0 && <div className="summary-row summary-row--discount"><span>Festival offer</span><span>−{formatPrice(discount)}</span></div>}<div className="summary-total"><span>Total</span><strong>{formatPrice(total)}</strong></div><p className="summary-disclaimer">No payment is processed. This is not a real purchase.</p></aside>
    </div>
  </section>;
}
