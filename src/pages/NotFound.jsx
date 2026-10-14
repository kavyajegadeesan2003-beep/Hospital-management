import { Link } from "react-router-dom";
import { HeartPulse } from "lucide-react";

export default function NotFound() {
  return <div className="not-found"><div className="brand-mark"><HeartPulse size={24} /></div><span className="eyebrow">PAGE NOT FOUND</span><h1>Looks like this page took a different turn.</h1><p>The page you’re looking for isn’t available.</p><Link to="/" className="primary-button">Back to overview</Link></div>;
}
