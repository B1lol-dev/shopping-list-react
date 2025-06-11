import { type ReactNode } from "react";

const Container = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`container mx-auto px-6 max-w-[1800px] w-full ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
