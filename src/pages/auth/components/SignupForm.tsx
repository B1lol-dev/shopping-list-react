import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { baseApi } from "@/api/api";
import { useAuthStore } from "@/store/auth.store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const SignUpSchema = z
  .object({
    name: z.string().min(1).max(30),
    username: z.string().min(1).max(30),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords does not match",
    path: ["confirmPassword"],
  });

type TSignUp = z.infer<typeof SignUpSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { register, handleSubmit, formState } = useForm<TSignUp>({
    resolver: zodResolver(SignUpSchema),
  });
  const { setToken } = useAuthStore();
  const navigate = useNavigate();

  const onSignUp = ({ name, username, password }: TSignUp) => {
    baseApi
      .post("/users", {
        name,
        username,
        password,
      })
      .then((res) => {
        toast.success(res.data.message);
        setToken(res.data.token);
        navigate("/dashboard");
      });
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit(onSignUp)}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign up</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          {formState.errors?.name && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>{formState.errors?.name.message}</AlertTitle>
            </Alert>
          )}
          <Input
            id="name"
            type="text"
            placeholder="Gadoy"
            {...register("name")}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          {formState.errors?.username && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>{formState.errors?.username.message}</AlertTitle>
            </Alert>
          )}
          <Input
            id="username"
            type="text"
            placeholder="gadoy123"
            {...register("username")}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          {formState.errors?.password && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>{formState.errors?.password.message}</AlertTitle>
            </Alert>
          )}
          <Input id="password" type="password" {...register("password")} />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="conf_password">Confirm Password</Label>
          </div>
          {formState.errors?.confirmPassword && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>
                {formState.errors?.confirmPassword.message}
              </AlertTitle>
            </Alert>
          )}
          <Input
            id="conf_password"
            type="password"
            {...register("confirmPassword")}
          />
        </div>
        <Button type="submit" className="w-full">
          Sign up
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => toast.error("bruh")}
        >
          Sign up with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}
