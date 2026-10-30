import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowRight, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCartCount } from "../../features/cart/cartSlice";
import { selectWishlistItems } from "../../features/wishlist/wishlistSlice";

const links = [
  { label: "Home", to: "/" },
  { label: "Shop all", to: "/shop" },
  { label: "Festival edit", to: "/shop?sort=newest" },
  { label: "Offers", to: "/offers" }
];

export default function Navbar() {
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistItems).length;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function submitSearch(event) {
    event.preventDefault();
    navigate(`/shop${searchText.trim() ? `?q=${encodeURIComponent(searchText.trim())}` : ""}`);
    setMenuOpen(false);
  }

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
      <div className="announcement"><span>ZENOVA</span><i /> Everything You Need. One Place. <Link to="/offers">Explore offers <ArrowRight size={12} /></Link></div>
      <div className="nav-wrap container">
        <button className="icon-button mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <Link to="/" className="wordmark" aria-label="ZENOVA home"><img src={`${import.meta.env.BASE_URL}zenova-logo.svg`} alt="ZENOVA — Everything You Need. One Place." /></Link>
        <nav className={`main-nav ${menuOpen ? "main-nav--open" : ""}`} aria-label="Main navigation">
          {links.map(({ label, to }) => <NavLink key={label} to={to} onClick={() => setMenuOpen(false)}>{label}</NavLink>)}
          <form className="mobile-search" onSubmit={submitSearch}><Search size={17} /><input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search the collection" aria-label="Search products" /></form>
        </nav>
        <div className="nav-actions">
          <form className="nav-search" onSubmit={submitSearch}><Search size={17} /><input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search products" aria-label="Search products" /></form>
          <Link className="icon-button" to="/wishlist" aria-label={`Wishlist, ${wishlistCount} items`}><Heart size={20} /><span className="count-badge">{wishlistCount}</span></Link>
          <Link className="icon-button" to="/cart" aria-label={`Shopping bag, ${cartCount} items`}><ShoppingBag size={20} /><span className="count-badge">{cartCount}</span></Link>
          <Link className="account-link" to="/login">Sign in <ArrowRight size={14} /></Link>
        </div>
      </div>
    </header>
  );
}
