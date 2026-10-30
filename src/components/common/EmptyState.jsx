import { PackageSearch } from "lucide-react";
import Button from "./Button";

export default function EmptyState({ title, text, action = "Explore the shop", to = "/shop" }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon"><PackageSearch size={25} /></div>
      <h2>{title}</h2>
      <p>{text}</p>
      <Button to={to}>{action}</Button>
    </div>
  );
}
