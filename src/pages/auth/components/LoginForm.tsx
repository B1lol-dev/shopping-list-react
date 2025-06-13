import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { baseApi } from "@/api/api";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

type TLogin = z.infer<typeof LoginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { register, handleSubmit, formState } = useForm<TLogin>({
    resolver: zodResolver(LoginSchema),
  });

  const { setToken } = useAuthStore();

  const onLogin = ({ username, password }: TLogin) => {
    baseApi
      .post("/auth", {
        username,
        password,
      })
      .then((res) => {
        setToken(res.data.token);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message || err.message);
      });
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit(onLogin)}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
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
            placeholder="username"
            {...register("username")}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              to=""
              className="ml-auto text-sm underline-offset-4 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                toast.error("just create new account lol");
              }}
            >
              Forgot your password?
            </Link>
          </div>
          {formState.errors?.password && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>{formState.errors?.password.message}</AlertTitle>
            </Alert>
          )}
          <Input
            id="password"
            type="password"
            placeholder="password"
            {...register("password")}
          />
        </div>
        <Button type="submit" className="w-full">
          Login
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
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/sign-up" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}
