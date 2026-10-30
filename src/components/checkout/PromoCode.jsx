import { useState } from "react";
import { Check, Tag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { applyOffer, clearOffer, selectOfferCode } from "../../features/offers/offerSlice";

export default function PromoCode() {
  const activeCode = useSelector(selectOfferCode);
  const dispatch = useDispatch();
  const [code, setCode] = useState(activeCode || "");
  const [message, setMessage] = useState("");

  function apply(event) {
    event.preventDefault();
    if (code.trim().toUpperCase() !== "FESTIVE10") {
      setMessage("That code didn't match. Try FESTIVE10.");
      return;
    }
    dispatch(applyOffer("FESTIVE10"));
    setCode("FESTIVE10");
    setMessage("Festival treat added — 10% off this demo basket.");
  }

  function remove() {
    dispatch(clearOffer());
    setCode("");
    setMessage("Offer removed.");
  }

  return (
    <div className="promo-code">
      <label htmlFor="promo-code-input"><Tag size={15} /> Have a little extra?</label>
      {activeCode ? (
        <div className="promo-code__active"><span><Check size={15} /> {activeCode} applied</span><button type="button" onClick={remove}>Remove</button></div>
      ) : (
        <form onSubmit={apply}><input id="promo-code-input" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Enter offer code" autoComplete="off" /><button type="submit">Apply</button></form>
      )}
      {message && <p className={activeCode ? "promo-code__message" : "promo-code__message promo-code__message--error"} role="status">{message}</p>}
      <small>Demo offer: FESTIVE10 takes 10% off. No external service is contacted.</small>
    </div>
  );
}
