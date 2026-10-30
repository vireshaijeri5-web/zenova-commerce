import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Heart, Minus, Plus, Star } from "lucide-react";
import { addToCart } from "../features/cart/cartSlice";
import { selectWishlistItems, toggleWishlist } from "../features/wishlist/wishlistSlice";
import { useToast } from "../hooks/useToast";
import { formatPrice } from "../components/products/ProductCard";
import ProductGrid from "../components/products/ProductGrid";
import EmptyState from "../components/common/EmptyState";

export default function ProductDetails() {
  const { id } = useParams();
  const product = useSelector((state) => state.products.items.find((item) => String(item.id) === id));
  const products = useSelector((state) => state.products.items);
  const wished = useSelector(selectWishlistItems).some((item) => String(item.id) === id);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const dispatch = useDispatch();
  const notify = useToast();
  const navigate = useNavigate();

  if (!product) {
    return <section className="page-section container">{products.length === 0 ? <div className="loading-state"><span className="spinner" />Finding this piece…</div> : <EmptyState title="We couldn't find that piece." text="It may have moved on to a new home." />}</section>;
  }

  const gallery = product.images?.filter(Boolean).length ? product.images.filter(Boolean) : [product.thumbnail];
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);

  return <section className="page-section container product-detail-page">
    <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><Link to="/shop">Shop</Link><span>/</span><span>{product.title}</span></div>
    <div className="product-detail">
      <div className="detail-gallery"><div className="detail-main-image"><img src={gallery[activeImage]} alt={product.title} /></div>{gallery.length > 1 && <div className="detail-thumbnails">{gallery.map((image, index) => <button className={index === activeImage ? "is-active" : ""} key={image} onClick={() => setActiveImage(index)} aria-label={`View image ${index + 1}`}><img src={image} alt="" /></button>)}</div>}</div>
      <div className="detail-info"><span className="eyebrow">{product.category} · {product.brand}</span><h1>{product.title}</h1>{product.rating && <div className="detail-rating"><Star size={16} fill="currentColor" /> {product.rating} {product.reviewCount ? <span>· {product.reviewCount} reviews</span> : ""}</div>}      <div className="detail-price-line"><div className="detail-price">{formatPrice(product.price)}</div>{product.originalPrice && <><del>{formatPrice(product.originalPrice)}</del><span className="product-sale-tag">-{product.discountPercentage}%</span></>}</div><p className="detail-description">{product.description}</p><div className="demo-stock"><span /> Available in this demo catalogue</div>
        <div className="detail-actions"><div className="quantity-control"><button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={15} /></button><span>{quantity}</span><button aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)}><Plus size={15} /></button></div><button className="button button--primary detail-add" onClick={() => { dispatch(addToCart({ ...product, quantity })); notify("Added to your bag"); }}>Add to bag — {formatPrice(product.price * quantity)}</button></div>
        <button className={`detail-wishlist ${wished ? "is-active" : ""}`} onClick={() => { dispatch(toggleWishlist(product)); notify(wished ? "Removed from your wishlist" : "Saved to your wishlist"); }}><Heart size={17} fill={wished ? "currentColor" : "none"} /> {wished ? "Saved to your wishlist" : "Add to wishlist"}</button>
        <div className="detail-assurance"><p>Thoughtful design, selected for everyday living.</p><small>Checkout and fulfilment shown here are frontend demo features.</small></div>
      </div>
    </div>
    {related.length > 0 && <div className="related-section"><div className="section-heading"><div><span className="eyebrow">More to love</span><h2>From the same <em>edit.</em></h2></div><button className="text-link" onClick={() => navigate(`/shop?category=${encodeURIComponent(product.category)}`)}>Shop {product.category}</button></div><ProductGrid products={related} /></div>}
    <Link className="back-link" to="/shop"><ArrowLeft size={16} /> Back to the collection</Link>
  </section>;
}
