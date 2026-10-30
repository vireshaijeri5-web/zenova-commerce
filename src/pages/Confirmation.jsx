import { useLocation, Link } from "react-router-dom";
import { Check } from "lucide-react";
import Button from "../components/common/Button";
import { formatPrice } from "../components/products/ProductCard";

export default function Confirmation() {
  const { state } = useLocation();
  if (!state?.orderNumber) return <section className="page-section container confirmation-page"><div className="confirmation-icon"><Check size={26} /></div><span className="eyebrow">Demo order</span><h1>All <em>done.</em></h1><p>This is a frontend demonstration. No real order has been placed.</p><Button to="/shop">Return to the collection</Button></section>;
  return <section className="page-section container confirmation-page"><div className="confirmation-icon"><Check size={26} /></div><span className="eyebrow">Demo order confirmed</span><h1>Thanks, {state.name.split(" ")[0] || "friend"}.</h1><p>Your demo order <strong>{state.orderNumber}</strong> has been created locally for this preview.{state.total ? <> Your demo total is <strong>{formatPrice(state.total)}</strong>{state.discount > 0 ? `, including ${formatPrice(state.discount)} off.` : "."}</> : ""}</p><div className="demo-notice"><span>Nothing was charged, and no order details were sent to an external service.</span></div><Button to="/shop">Keep exploring <span aria-hidden="true">→</span></Button></section>;
}
