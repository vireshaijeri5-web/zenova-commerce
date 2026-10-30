import { useState } from "react";
import { ArrowUpRight, Instagram, Linkedin, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");

  function subscribe(event) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNotice("Enter a valid email address to continue.");
      return;
    }
    setNotice("Thanks for joining us. This demo keeps your email local.");
    setEmail("");
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="wordmark wordmark--footer"><img src={`${import.meta.env.BASE_URL}zenova-logo-light.svg`} alt="ZENOVA — Everything You Need. One Place." /></Link>
            <p>ZENOVA brings the things you need together in one place, with everyday essentials and delightful finds.</p>
            <div className="social-links"><a href="https://www.instagram.com/" aria-label="Instagram"><Instagram size={18} /></a><a href="https://www.linkedin.com/" aria-label="LinkedIn"><Linkedin size={18} /></a></div>
          </div>
          <div className="footer-links"><h3>Explore</h3><Link to="/shop">All products</Link><Link to="/offers">Festival offers</Link><Link to="/shop?category=Technology">Technology</Link><Link to="/shop?category=Home%20Essentials">Home essentials</Link></div>
          <div className="footer-links"><h3>Here to help</h3><Link to="/login">Your account</Link><Link to="/cart">Your bag</Link><Link to="/wishlist">Wishlist</Link><a href="mailto:hello@example.com">Contact <span className="demo-label">(demo)</span></a></div>
          <div className="footer-newsletter"><h3>A note from ZENOVA</h3><p>Occasional inspiration, new arrivals, and thoughtful finds.</p><form onSubmit={subscribe}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" required /><button type="submit" aria-label="Join newsletter"><Send size={17} /></button></form>{notice && <p className="newsletter-notice" role="status">{notice}</p>}<small>Local demo form — no external service is contacted.</small></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} ZENOVA. Everything You Need. One Place.</span><span>Secure checkout is a frontend demonstration only.</span><a href="#top" className="back-top">Back to top <ArrowUpRight size={14} /></a></div>
      </div>
    </footer>
  );
}
