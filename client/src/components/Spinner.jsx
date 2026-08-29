import { Loader2 } from "lucide-react";

function Spinner({ className = "size-6" }) {
  return <Loader2 className={`animate-spin text-primary ${className}`} aria-label="Loading" />;
}

export default Spinner;
