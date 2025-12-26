import React from "react";
function Card({ children, className = "", padding = "p-6", ...props }) {
  return (
    <div className={`card ${padding} ${className}`} {...props}>
      {" "}
      {children}{" "}
    </div>
  );
}
function CardHeader({ children, className = "" }) {
  return <div className={`mb-6 ${className}`}>{children}</div>;
}
function CardTitle({ children, icon: Icon, className = "" }) {
  return (
    <h3
      className={`text-xl font-semibold flex items-center gap-2 ${className}`}
    >
      {" "}
      {Icon && <Icon className="text-primary" size={24} />} {children}{" "}
    </h3>
  );
}
function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
export default Card;
