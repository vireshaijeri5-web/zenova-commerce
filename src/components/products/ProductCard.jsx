import { useState } from "react";
import { ArrowUpRight, Heart, Plus, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { selectWishlistItems, toggleWishlist } from "../../features/wishlist/wishlistSlice";
import { useToast } from "../../hooks/useToast";

export function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price || 0);
}

export default function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch();
  const notify = useToast();
  const wished = useSelector(selectWishlistItems).some((item) => item.id === product.id);
  const [imageFailed, setImageFailed] = useState(false);

  function quickAdd() {
    dispatch(addToCart(product));
    notify("Added to your bag");
  }

  function toggleWish() {
    dispatch(toggleWishlist(product));
    notify(wished ? "Removed from your wishlist" : "Saved to your wishlist");
  }

  return (
    <article className="product-card" style={{ "--card-index": index }}>
      <div className="product-card__media">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.title}`}>
          {imageFailed || !product.thumbnail ? <div className="image-fallback"><span>ZENOVA</span><small>Everything you need</small></div> : <img src={product.thumbnail} alt={product.title} loading="lazy" onError={() => setImageFailed(true)} />}
        </Link>
        {product.discountPercentage && <span className="product-sale-tag">-{product.discountPercentage}%</span>}
        <button className={`wishlist-toggle ${wished ? "is-active" : ""}`} type="button" aria-label={wished ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`} aria-pressed={wished} onClick={toggleWish}><Heart size={18} fill={wished ? "currentColor" : "none"} /></button>
        <button className="quick-add" type="button" onClick={quickAdd}><Plus size={16} /> Add to bag <ArrowUpRight size={14} /></button>
      </div>
      <div className="product-card__details">
        <div className="product-card__eyebrow"><span>{product.category}</span>{product.rating && <span className="rating"><Star size={13} fill="currentColor" /> {product.rating}</span>}</div>
        <Link to={`/product/${product.id}`} className="product-card__title">{product.title}</Link>
        <div className="product-price-line"><span className="product-card__price">{formatPrice(product.price)}</span>{product.originalPrice && <del>{formatPrice(product.originalPrice)}</del>}</div>
      </div>
    </article>
  );
}
