import { baseApi } from "@/api/api";
import Container from "@/components/helpers/Container";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    baseApi
      .get("/auth", {
        headers: {
          "X-Auth-Token": token,
        },
      })
      .then((res) => setUser(res.data));
  }, [token, navigate]);

  console.log(user);

  return (
    <section>
      <Container>
        <h1 className="text-4xl">Your profile</h1>
        <div className="mt-4">
          <Avatar className="size-30 text-5xl uppercase">
            <AvatarFallback className="bg-black text-white">
              {user?.name[0]}
            </AvatarFallback>
          </Avatar>
          <h1 className="capitalize">{user?.name}</h1>
          <h2>{user?.username}</h2>
          {user.status == "active" ? (
            <Badge variant="default">active</Badge>
          ) : (
            <Badge variant="destructive">inactive</Badge>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Dashboard;
