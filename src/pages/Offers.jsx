import { ArrowRight, BadgePercent, Gift, Sparkles, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "../components/common/Button";
import ProductGrid from "../components/products/ProductGrid";
import { ProductSkeletons } from "../components/common/Loader";

export default function Offers() {
  const { items: products, status } = useSelector((state) => state.products);
  const realDeals = products.filter((item) => item.discountPercentage).slice(0, 8);
  const favourites = realDeals.length ? realDeals : products.slice(0, 4);

  return <div className="offers-page">
    <section className="offers-hero"><div className="container offers-hero__inner"><div><span className="festival-kicker"><Sparkles size={14} /> A LITTLE FESTIVAL MAGIC</span><h1>Good offers.<br /><em>Great finds.</em></h1><p>A brighter way to browse. Explore verified product markdowns when available, or use our local demo offer at checkout.</p><Button to="/shop">Explore the collection <ArrowRight size={17} /></Button></div><div className="offers-hero__visual"><div className="offers-orbit"><BadgePercent size={58} strokeWidth={1.2} /></div><div className="offers-hero__ticket"><small>YOUR LITTLE EXTRA</small><strong>10<sup>%</sup></strong><span>OFF YOUR DEMO BASKET</span><b>FESTIVE10</b></div><span className="offers-confetti offers-confetti--one">✳</span><span className="offers-confetti offers-confetti--two">✦</span></div></div></section>
    <section className="container offers-content"><div className="offers-rule"><span><Gift size={18} /></span><div><h2>One little code. A little more joy.</h2><p>Enter <strong>FESTIVE10</strong> in your bag or checkout to see a 10% demo discount applied to your basket total.</p></div><Link to="/shop">Start shopping <ArrowRight size={16} /></Link></div>
      <div className="offers-disclaimer"><Tag size={16} /><span>This is a portfolio/demo promotion. Discount is calculated locally; no real payment, purchase, or offer redemption occurs.</span></div>
      <div className="offers-products"><div className="festival-section__heading"><div><span className="festival-eyebrow"><span /> PRODUCT MARKDOWNS</span><h2>{realDeals.length ? "Lower prices, " : "A little something "}<em>{realDeals.length ? "when available." : "to love."}</em></h2><p>{realDeals.length ? "These price reductions come from the product data source." : "No verified markdowns are supplied right now. Here are a few picks from the NOVA edit."}</p></div></div>{status === "loading" && !products.length ? <ProductSkeletons count={4} /> : <ProductGrid products={favourites} />}</div>
      <div className="offers-bottom"><Button to="/shop" variant="outline">Back to the full collection <ArrowRight size={16} /></Button></div>
    </section>
  </div>;
}
