import { baseApi } from "@/api/api";
import Container from "@/components/helpers/Container";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthStore } from "@/store/auth.store";
import { DoorOpen, MoreHorizontal, Trash, UserPlus2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GroupItems from "./components/GroupItems";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import GroupUsers from "./components/GroupUsers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

const Group = () => {
  const { id } = useParams();
  const { token } = useAuthStore();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [group, setGroup] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any>([]);
  const [user, setUser] = useState<{ _id: string }>();

  useEffect(() => {
    setLoading(true);

    baseApi
      .get("/auth", {
        headers: {
          "X-Auth-Token": token,
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));

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
        setUsers(
          res.data.filter((group: { _id: string }) => group._id === id)[0]
            .members
        );
      })
      .finally(() => setLoading(false));
  }, [token, id]);

  const handleDeleteGroup = () => {
    baseApi
      .delete(`/groups/${id}`, {
        headers: {
          "X-Auth-Token": token,
        },
      })
      .then((res) => {
        toast.success(res.data.message);
        navigate("/dashboard");
        location.reload();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong");
      });
  };

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
                {group?.owner?._id !== user?._id ? (
                  <Button className="w-full" variant="destructive">
                    <DoorOpen /> Leave group
                  </Button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button className="w-full" variant="destructive">
                        <Trash /> Delete group
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete this group and remove group's data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteGroup}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
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
          <TabsContent value="users">
            <GroupUsers users={users} setUsers={setUsers} group={group} />
          </TabsContent>
        </Tabs>
      </Container>
    </section>
  );
};

export default Group;
