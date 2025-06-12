import { baseApi } from "@/api/api";
import Container from "@/components/helpers/Container";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthStore } from "@/store/auth.store";
import { DoorOpen, MoreHorizontal, UserPlus2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GroupItems from "./components/GroupItems";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const Group = () => {
  const { id } = useParams();
  const { token } = useAuthStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [group, setGroup] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any>([]);

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
        setItems(
          res.data.filter((group: { _id: string }) => group._id === id)[0].items
        );
      })
      .finally(() => setLoading(false));
  }, [token, id]);
  console.log(group);

  if (loading) {
    return <section>Loading...</section>;
  }

  return (
    <section>
      <Container>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl">{group?.name}</h1>
          <div className="flex items-center gap-3">
            <Button disabled>
              Owner: <h1 className="capitalize">{group?.owner?.name}</h1>
              <p>({group?.owner?.username})</p>
            </Button>
            <Popover>
              <PopoverTrigger>
                <Button>
                  <MoreHorizontal />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-3 items-center max-w-[150px]">
                <Button className="w-full">
                  <UserPlus2 />
                  Add User
                </Button>
                <Button className="w-full" variant="destructive">
                  <DoorOpen /> Leave group
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Tabs defaultValue="items" className="mt-5">
          <TabsList className="w-full">
            <TabsTrigger value="items">Items</TabsTrigger>
            <Separator orientation="vertical" />
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <TabsContent value="items">
            <GroupItems
              items={items}
              groupId={group?._id}
              setItems={setItems}
            />
          </TabsContent>
          <TabsContent value="users">Users</TabsContent>
        </Tabs>
      </Container>
    </section>
  );
};

export default Group;
