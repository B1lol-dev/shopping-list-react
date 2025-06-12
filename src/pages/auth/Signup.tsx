import { ShoppingCart } from "lucide-react";
import { SignupForm } from "./components/SignupForm";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Signup = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  });

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <ShoppingCart className="size-4" />
            </div>
            Shopping list
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIi1TbJudxdUQwD97wW9yRrVQA1z7HxqYbiA&s"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default Signup;
