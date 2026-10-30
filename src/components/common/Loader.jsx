export function ProductSkeletons({ count = 8 }) {
  return <div className="product-grid" aria-label="Loading products">{Array.from({ length: count }, (_, index) => <div className="skeleton-card" key={index}><div className="skeleton skeleton--image" /><div className="skeleton skeleton--line" /><div className="skeleton skeleton--short" /></div>)}</div>;
}

export default function Loader({ label = "Loading your edit…" }) {
  return <div className="loading-state" role="status"><span className="spinner" />{label}</div>;
}
