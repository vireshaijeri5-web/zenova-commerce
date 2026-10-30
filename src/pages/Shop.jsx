import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductGrid from "../components/products/ProductGrid";
import EmptyState from "../components/common/EmptyState";
import { ProductSkeletons } from "../components/common/Loader";
import { loadProducts } from "../features/products/productsSlice";

const categoryOptions = ["Technology", "Lifestyle", "Home Essentials", "Accessories"];

export default function Shop() {
  const { items, status, error, source } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();
  const [mobileFilters, setMobileFilters] = useState(false);
  const search = params.get("q") || "";
  const category = params.get("category") || "";
  const sort = params.get("sort") || "featured";

  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  const filtered = useMemo(() => {
    let result = items.filter((product) => product.title.toLowerCase().includes(search.toLowerCase()) && (!category || product.category.toLowerCase() === category.toLowerCase()));
    if (sort === "low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "rating") result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === "newest") result = [...result].sort((a, b) => Number(b.id) - Number(a.id));
    return result;
  }, [items, search, category, sort]);

  const filters = <div className="filter-stack">
    <label className="filter-label" htmlFor="shop-search">Search products</label>
    <div className="filter-search"><Search size={17} /><input id="shop-search" value={search} onChange={(event) => updateParam("q", event.target.value)} placeholder="Try headphones…" /></div>
    <div className="filter-group"><h3>Category</h3><button className={`filter-option ${!category ? "is-selected" : ""}`} onClick={() => updateParam("category", "")}><span>All products</span><span>{items.length}</span></button>{categoryOptions.map((option) => <button key={option} className={`filter-option ${category === option ? "is-selected" : ""}`} onClick={() => updateParam("category", category === option ? "" : option)}><span>{option}</span><span>{items.filter((product) => product.category === option).length}</span></button>)}</div>
    <button className="clear-filters" onClick={() => setParams({}, { replace: true })}>Clear all filters <X size={14} /></button>
  </div>;

  return <section className="page-section container shop-page">
    <div className="page-intro shop-intro"><span className="eyebrow">A considered collection</span><h1>Shop the <em>edit.</em></h1><p>Everyday objects, chosen with intention.</p></div>
    <div className="shop-categories" id="categories" aria-label="Filter by category">{categoryOptions.map((option) => <button key={option} className={category === option ? "is-selected" : ""} onClick={() => updateParam("category", category === option ? "" : option)}>{option}</button>)}</div>
    <div className="shop-layout">
      <aside className={`shop-filters ${mobileFilters ? "shop-filters--open" : ""}`} aria-label="Product filters"><div className="mobile-filter-title"><strong>Filters</strong><button className="icon-button" onClick={() => setMobileFilters(false)} aria-label="Close filters"><X size={20} /></button></div>{filters}</aside>
      <div className="shop-results"><div className="results-toolbar"><span>{filtered.length} {filtered.length === 1 ? "piece" : "pieces"} in the edit</span><button className="filter-open button button--outline" onClick={() => setMobileFilters(true)}><SlidersHorizontal size={16} /> Filters</button><label className="sort-control"><span>Sort by</span><select value={sort} onChange={(event) => updateParam("sort", event.target.value)}><option value="featured">Featured</option><option value="newest">New arrivals</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Top rated</option></select></label></div>
        {status === "loading" && !items.length ? <ProductSkeletons /> : filtered.length ? <ProductGrid products={filtered} /> : <EmptyState title="Nothing here just yet." text="We couldn't find anything matching those filters. Try another search or start fresh." action="Clear filters" to="/shop" />}
        {error && <p className="data-note" role="status">{error} <button className="retry-button" onClick={() => dispatch(loadProducts({ retry: true }))} disabled={status === "loading"}>Try again</button></p>}
        {status === "loading" && source === "fallback" && <p className="data-note" role="status">Checking the live catalogue…</p>}
      </div>
    </div>
  </section>;
}
