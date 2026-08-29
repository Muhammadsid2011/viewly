import { useState } from "react";

// Avatar with graceful fallback to initials when the image is missing or fails.
function Avatar({ src, name = "", size = 40, className = "" }) {
  const [errored, setErrored] = useState(false);
  const initials =
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";
  const style = { width: size, height: size };

  if (src && !errored) {
    return (
      <img
        src={src}
        alt={name || "avatar"}
        style={style}
        onError={() => setErrored(true)}
        className={`rounded-full object-cover flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      style={style}
      className={`rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-semibold flex-shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      <span style={{ fontSize: Math.max(11, size * 0.4) }}>{initials}</span>
    </div>
  );
}

export default Avatar;
