import { baseApi } from "@/api/api";
import Container from "@/components/helpers/Container";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Group = () => {
  const { id } = useParams();
  const { token } = useAuthStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [group, setGroup] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    baseApi
      .get("/groups", {
        headers: {
          "X-Auth-Token": token,
        },
      })
      .then((res) => {
        setGroup(
          res.data.filter((group: { _id: string }) => group._id === id)[0]
        );
      })
      .finally(() => setLoading(false));
  }, [token, id]);

  if (loading) {
    return <section>Loading...</section>;
  }

  return (
    <section>
      <Container>
        <h1 className="text-4xl">{group?.name}</h1>
      </Container>
    </section>
  );
};

export default Group;
