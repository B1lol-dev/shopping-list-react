import { baseApi } from "@/api/api";
import Container from "@/components/helpers/Container";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { Copy, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCopyToClipboard } from "react-use";

const Dashboard = () => {
  const { token, removeToken } = useAuthStore();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    setLoading(true);
    baseApi
      .get("/auth", {
        headers: {
          "X-Auth-Token": token,
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        if (err?.response?.data?.message === "Unauthorized") {
          removeToken();
        }
      })
      .finally(() => setLoading(false));
  }, [token, navigate, removeToken]);

  console.log(user);

  const handleCopyUsername = () => {
    copyToClipboard(user?.username);
    toast.success(`${user?.username} copied to clipboard`);
  };

  const handleDeleteAccount = () => {
    toast.success("Account deleted successfully");
  };

  if (loading) {
    return <section>Loading...</section>;
  }

  return (
    <section>
      <Container>
        <h1 className="text-4xl">Your profile</h1>
        <div className="mt-4 flex justify-center gap-4 items-center">
          <div className="flex flex-col items-center">
            <Avatar className="size-30 text-5xl uppercase">
              <AvatarFallback className="bg-black text-white">
                {user?.name[0]}
              </AvatarFallback>
            </Avatar>
            {user?.status == "active" ? (
              <Badge variant="default" className="mt-3">
                active
              </Badge>
            ) : (
              <Badge variant="destructive" className="mt-3">
                inactive
              </Badge>
            )}
          </div>
          <div>
            <h1 className="capitalize text-2xl">{user?.name}</h1>
            <h2 className="text-xl">@{user?.username}</h2>
            <div className="flex flex-col gap-2 mt-2">
              <Button onClick={handleCopyUsername}>
                <Copy /> Copy username
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                <Trash /> Delete account
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Dashboard;
