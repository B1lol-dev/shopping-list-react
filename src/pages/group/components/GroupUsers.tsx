import { baseApi } from "@/api/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/store/auth.store";
import { Minus } from "lucide-react";
import {
  memo,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { toast } from "react-hot-toast";

interface IUser {
  _id: string;
  name: string;
  username: string;
  createdAt: string;
  status: "active" | "inactive";
}

interface IGroupUsersProps {
  users: IUser[];
  group: {
    _id: string;
    owner: {
      _id: string;
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUsers: Dispatch<SetStateAction<any[]>>;
}

const GroupUsers = ({ users, setUsers, group }: IGroupUsersProps) => {
  const [me, setMe] = useState<{ _id: string }>();
  const { token } = useAuthStore();

  useEffect(() => {
    baseApi
      .get("/auth", {
        headers: {
          "X-Auth-Token": token,
        },
      })
      .then((res) => {
        setMe(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  const handleDeleteUser = (id: string) => {
    baseApi
      .delete(`/groups/${group._id}/members/${id}`, {
        headers: {
          "X-Auth-Token": token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setUsers((prev) => prev.filter((user) => user._id !== id));
        toast.success("User deleted from group");
      });
  };
  console.log(users);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1>
          Users <Badge>{users?.length}</Badge>
        </h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Joined at</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.createdAt}</TableCell>
              <TableCell className="flex gap-3 items-center">
                {user.status === "active" ? (
                  <>
                    <Badge variant="outline">active</Badge>
                  </>
                ) : (
                  <>
                    <Badge>inactive</Badge>
                  </>
                )}
                {user._id !== me?._id && group?.owner?._id === me?._id && (
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    <Minus />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default memo(GroupUsers);
