// src/components/ui/card.jsx
export function Card({ children, className }) {
  return (
    <div className={`p-4 rounded-xl shadow-lg bg-white/10 ${className}`}>
      {children}
    </div>
  );
}
