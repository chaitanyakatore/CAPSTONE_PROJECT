import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void; // Make onClick optional
  disabled?: boolean; // Add the disabled prop
  className?: string; // Optional for additional styling
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      type="submit" // This button will act as a submit button
      disabled={disabled} // Disable the button if the disabled prop is true
    >
      {text}
    </button>
  );
};

export default Button;
