import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import EmptyState from "../components/common/EmptyState";
import { addToCart } from "../features/cart/cartSlice";
import { removeFromWishlist, selectWishlistItems } from "../features/wishlist/wishlistSlice";
import { formatPrice } from "../components/products/ProductCard";
import { useToast } from "../hooks/useToast";

export default function Wishlist() {
  const items = useSelector(selectWishlistItems);
  const dispatch = useDispatch();
  const notify = useToast();

  if (!items.length) return <section className="page-section container"><div className="page-intro"><span className="eyebrow">Your saved pieces</span><h1>A list of <em>maybes.</em></h1></div><EmptyState title="Nothing saved just yet." text="When something catches your eye, tap the little heart and it will be waiting here." action="Browse the collection" /></section>;

  return <section className="page-section container"><div className="page-intro"><span className="eyebrow">Your saved pieces</span><h1>A list of <em>maybes.</em></h1><p>{items.length} {items.length === 1 ? "favourite" : "favourites"}, saved for later.</p></div>
    <div className="wishlist-grid">{items.map((item) => <article className="wishlist-card" key={item.id}><img src={item.thumbnail} alt={item.title} /><button className="wishlist-remove" onClick={() => dispatch(removeFromWishlist(item.id))} aria-label={`Remove ${item.title}`}><Trash2 size={17} /></button><div className="wishlist-card__info"><span className="eyebrow">{item.category}</span><h2>{item.title}</h2><strong>{formatPrice(item.price)}</strong><button className="button button--outline" onClick={() => { dispatch(addToCart(item)); notify("Added to your bag"); }}><ShoppingBag size={16} /> Add to bag</button></div></article>)}</div>
  </section>;
}
