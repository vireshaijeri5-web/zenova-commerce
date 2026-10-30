import { Link } from "react-router-dom";

export default function Button({ children, to, variant = "primary", className = "", ...props }) {
  const classes = `button button--${variant} ${className}`.trim();
  return to ? <Link className={classes} to={to} {...props}>{children}</Link> : <button className={classes} {...props}>{children}</button>;
}
