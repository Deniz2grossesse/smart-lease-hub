
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends HTMLAttributes<HTMLDivElement> {}

const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <div className={cn("relative", className)} {...props}>
      <div className="relative w-full h-full bg-brand-red">
        <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-white"></div>
        <div className="absolute top-1/2 left-1/4 w-1/4 h-1/4 bg-brand-red"></div>
        <div className="absolute top-1/4 left-1/2 w-1/4 h-1/4 bg-brand-red"></div>
        <div className="absolute top-1/2 left-1/2 w-1/4 h-1/4 bg-white"></div>
      </div>
    </div>
  );
};

export default Logo;
