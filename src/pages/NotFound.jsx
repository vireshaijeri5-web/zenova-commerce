import Button from "../components/common/Button";

export default function NotFound() {
  return <section className="page-section container not-found"><span className="not-found__number">404</span><span className="eyebrow">A small detour</span><h1>This page took<br /><em>another way.</em></h1><p>The page you're looking for isn't here. Let's get you back to something good.</p><Button to="/">Back to ZENOVA</Button></section>;
}
