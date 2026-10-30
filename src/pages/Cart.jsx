import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import EmptyState from "../components/common/EmptyState";
import { formatPrice } from "../components/products/ProductCard";
import { clearCart, decrementQuantity, incrementQuantity, removeFromCart, selectCartItems, selectCartSubtotal } from "../features/cart/cartSlice";
import PromoCode from "../components/checkout/PromoCode";
import { clearOffer, selectOfferDiscount } from "../features/offers/offerSlice";

export default function Cart() {
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const discount = useSelector(selectOfferDiscount);
  const total = subtotal - discount;
  const dispatch = useDispatch();

  function clearBag() {
    if (window.confirm("Clear all items from your bag?")) {
      dispatch(clearCart());
      dispatch(clearOffer());
    }
  }

  if (!items.length) return <section className="page-section container"><div className="page-intro"><span className="eyebrow">Your ZENOVA bag</span><h1>A little <em>empty.</em></h1></div><EmptyState title="Your bag is waiting." text="A few thoughtful finds can make all the difference." action="Explore the collection" /></section>;

  return <section className="page-section container">
    <div className="page-intro cart-intro"><div><span className="eyebrow">Your ZENOVA bag</span><h1>Good choices, <em>gathered.</em></h1><p>{items.reduce((sum, item) => sum + item.quantity, 0)} {items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "piece" : "pieces"} in your bag</p></div><button className="text-link remove-all" onClick={clearBag}><Trash2 size={15} /> Clear bag</button></div>
    <div className="cart-layout"><div className="cart-items">{items.map((item) => <article className="cart-item" key={item.id}><Link to={`/product/${item.id}`} className="cart-item__image"><img src={item.thumbnail} alt={item.title} /></Link><div className="cart-item__details"><span className="eyebrow">{item.category}</span><Link to={`/product/${item.id}`} className="cart-item__title">{item.title}</Link><span className="cart-item__unit">{formatPrice(item.price)} each</span><div className="quantity-control"><button aria-label={`Decrease ${item.title} quantity`} disabled={item.quantity <= 1} onClick={() => dispatch(decrementQuantity(item.id))}><Minus size={14} /></button><span>{item.quantity}</span><button aria-label={`Increase ${item.title} quantity`} onClick={() => dispatch(incrementQuantity(item.id))}><Plus size={14} /></button></div></div><div className="cart-item__right"><strong>{formatPrice(item.price * item.quantity)}</strong><button className="remove-item" onClick={() => dispatch(removeFromCart(item.id))} aria-label={`Remove ${item.title}`}><Trash2 size={17} /></button></div></article>)}</div>
      <aside className="checkout-summary"><span className="eyebrow">A quick summary</span><h2>Your total.</h2><div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><PromoCode />{discount > 0 && <div className="summary-row summary-row--discount"><span>Festival offer</span><span>−{formatPrice(discount)}</span></div>}<div className="summary-row"><span>Delivery</span><span>Calculated in this demo</span></div><div className="summary-total"><span>Total</span><strong>{formatPrice(total)}</strong></div><Link to="/checkout" className="button button--primary summary-checkout">Continue to checkout <ShoppingBag size={16} /></Link><p className="summary-disclaimer">Demo checkout only. No payment or real order will be made.</p><Link className="summary-continue" to="/shop">Continue browsing</Link></aside>
    </div>
  </section>;
}
