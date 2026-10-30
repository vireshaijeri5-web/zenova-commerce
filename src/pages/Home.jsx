import { useEffect } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Gift, Heart, PartyPopper, Sparkles, Star, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/common/Button";
import { ProductSkeletons } from "../components/common/Loader";
import ProductGrid from "../components/products/ProductGrid";
import { loadProducts } from "../features/products/productsSlice";

const categories = [
  { title: "Technology", text: "Little upgrades. Big energy.", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900&q=85", tone: "lilac" },
  { title: "Lifestyle", text: "Made for your kind of everyday.", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=85", tone: "peach" },
  { title: "Home Essentials", text: "Bring a little joy home.", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85", tone: "mint" },
  { title: "Accessories", text: "The finishing touches.", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85", tone: "lemon" }
];

export default function Home() {
  const { items, status, error, source } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const featured = items.slice(0, 8);

  useEffect(() => {
    const revealSections = document.querySelectorAll(".festival-reveal");
    if (!("IntersectionObserver" in window)) {
      revealSections.forEach((section) => section.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="festival-home">
      <section className="festival-hero">
        <div className="festival-hero__glow festival-hero__glow--one" />
        <div className="festival-hero__glow festival-hero__glow--two" />
        <div className="container festival-hero__layout">
          <div className="festival-hero__copy">
            <span className="festival-kicker"><Sparkles size={14} /> THE ZENOVA FESTIVAL EDIT <span>2026</span></span>
            <h1>Big joy.<br /><em>Little prices.</em></h1>
            <p>Find thoughtful favourites, feel-good finds, and small upgrades that make every day a celebration.</p>
            <div className="festival-hero__actions"><Button to="/shop">Shop the festival <ArrowRight size={17} /></Button><Link to="/offers" className="festival-link">See this season’s offers <ArrowUpRight size={16} /></Link></div>
            <div className="festival-hero__social"><span className="avatar-stack"><i>N</i><i>+</i><i>♥</i></span><span>A little something for <strong>every kind of you.</strong></span></div>
          </div>
          <div className="festival-hero__art">
            <div className="festival-hero__image"><img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1500&q=90" alt="A bright, welcoming interior filled with thoughtful home details" /><span className="festival-hero__image-label">THE JOY OF EVERYDAY</span></div>
            <div className="festival-sticker"><span>GOOD<br />FINDS</span><Star size={15} fill="currentColor" /></div>
            <Link to="/offers" className="festival-code-card"><span className="festival-code-card__icon"><Gift size={19} /></span><span><small>A little festival treat</small><strong>10% off with FESTIVE10</strong><small>Demo offer · at checkout</small></span><ArrowUpRight size={17} /></Link>
            <div className="festival-sparkle festival-sparkle--a">✳</div><div className="festival-sparkle festival-sparkle--b">✦</div>
          </div>
        </div>
        <a className="festival-scroll" href="#festival-favourites"><span>SCROLL FOR THE GOOD STUFF</span><ArrowDown size={14} /></a>
      </section>

      <section className="festival-benefits festival-reveal"><div className="container festival-benefits__row"><div><Gift size={19} /><span><strong>Little extras</strong><small>Offers for your next find</small></span></div><div><Truck size={19} /><span><strong>Easy to explore</strong><small>Browse at your own pace</small></span></div><div><Heart size={19} /><span><strong>Save what you love</strong><small>Your wishlist stays yours</small></span></div><div><PartyPopper size={19} /><span><strong>All the festive feels</strong><small>A brighter ZENOVA edit</small></span></div></div></section>

      <section className="festival-section container festival-reveal" id="festival-favourites">
        <div className="festival-section__heading"><div><span className="festival-eyebrow"><span /> THE FESTIVAL LINE-UP</span><h2>Find your <em>happy.</em></h2><p>Good things to gift, keep, and make your own.</p></div><Link to="/shop" className="festival-round-link">Shop everything <ArrowUpRight size={17} /></Link></div>
        <div className="festival-category-grid">{categories.map((category, index) => <Link className={`festival-category festival-category--${category.tone}`} to={`/shop?category=${encodeURIComponent(category.title)}`} key={category.title}><div className="festival-category__image"><img src={category.image} alt="" loading="lazy" /><span className="festival-category__number">0{index + 1}</span><span className="festival-category__arrow"><ArrowUpRight size={17} /></span></div><div className="festival-category__caption"><h3>{category.title}</h3><p>{category.text}</p></div></Link>)}</div>
      </section>

      <section className="festival-product-band festival-reveal">
        <div className="container festival-section">
          <div className="festival-section__heading"><div><span className="festival-eyebrow"><span /> GOOD THINGS, GATHERED</span><h2>Fan <em>favourites.</em></h2><p>Little things with main-character energy.</p></div><Link to="/shop" className="festival-round-link">Browse the collection <ArrowUpRight size={17} /></Link></div>
          {status === "loading" && items.length === 0 ? <ProductSkeletons /> : <ProductGrid products={featured} />}
          {error && <p className="data-note" role="status">{error} <button className="retry-button" onClick={() => dispatch(loadProducts({ retry: true }))} disabled={status === "loading"}>Try again</button></p>}
          {status === "loading" && source === "fallback" && <p className="data-note" role="status">Checking the live catalogue…</p>}
          <div className="festival-view-all"><Button to="/shop" variant="outline">Meet the whole collection <ArrowRight size={16} /></Button></div>
        </div>
      </section>

      <section className="festival-offer-banner container festival-reveal">
        <div className="festival-offer-banner__art"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=85" alt="A cozy living room prepared for a special celebration" loading="lazy" /><span className="festival-offer-banner__burst">A LITTLE<br />EXTRA JOY</span></div>
        <div className="festival-offer-banner__copy"><span className="festival-eyebrow"><span /> YOUR FESTIVAL LITTLE EXTRA</span><h2>One more reason<br />to <em>celebrate.</em></h2><p>Take 10% off your demo basket with our festival code. A playful preview of how a store-wide offer could feel.</p><div className="festival-coupon"><span><small>ENTER AT CHECKOUT</small><strong>FESTIVE10</strong></span><Link to="/offers" aria-label="View festival offer">Get the offer <ArrowRight size={16} /></Link></div><small className="festival-disclaimer">Demo promotion only. No real payment or purchase.</small></div>
      </section>

      <section className="festival-last-call festival-reveal"><div className="container festival-last-call__inner"><div><span className="festival-eyebrow"><span /> A LITTLE NOTE FROM ZENOVA</span><h2>Make room for <em>more joy.</em></h2><p>Fresh finds, happy ideas, and the occasional reason to treat yourself.</p></div><Link to="/shop" className="festival-last-call__button">Find your next favourite <ArrowRight size={16} /></Link></div></section>
    </div>
  );
}
