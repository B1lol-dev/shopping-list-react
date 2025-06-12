import { baseApi } from "@/api/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/store/auth.store";
import { Plus, ShoppingCart, X } from "lucide-react";
import {
  memo,
  useEffect,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import toast from "react-hot-toast";

interface IGroupItem {
  _id: string;
  title: string;
  createdAt: string;
  isBought: boolean;
  boughtBy: {
    username: string;
    name: string;
  };
  owner: {
    username: string;
    name: string;
    _id: string;
  };
}

interface IGroupItemsProps {
  items: IGroupItem[];
  groupId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setItems: Dispatch<SetStateAction<any[]>>;
}

const GroupItems = ({ items, groupId, setItems }: IGroupItemsProps) => {
  const [newItem, setNewItem] = useState<string>("");
  const { token } = useAuthStore();
  const [user, setUser] = useState<{ _id: string }>();

  useEffect(() => {
    baseApi
      .get("/auth", {
        headers: {
          "X-Auth-Token": token,
        },
      })
      .then((res) => {
        setUser(res.data);
      });
  }, [token]);

  console.log(user);

  const handleAddNewItem = (e: FormEvent) => {
    e.preventDefault();

    baseApi
      .post(
        "/items",
        {
          groupId: groupId,
          title: newItem,
        },
        {
          headers: {
            "X-Auth-Token": token,
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setItems((p) => [...p, res.data.item]);
      })
      .catch((err) => toast.error(err.message));
  };
  console.log(items);

  const handleDeleteItem = (id: string) => {
    baseApi
      .delete(`/items/${id}`, {
        headers: {
          "X-Auth-Token": token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setItems((prev) => prev.filter((item) => item._id !== id));
        toast.success("Item deleted successfully");
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.error(err);
      });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1>
          Items <Badge>{items.length}</Badge>
        </h1>
        <form className="flex" onSubmit={handleAddNewItem}>
          <Input
            placeholder="Add new item"
            onChange={(e) => setNewItem(e.target.value)}
            value={newItem}
          />
          <Button type="submit">
            <Plus />
          </Button>
        </form>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.owner.name}</TableCell>
              <TableCell>{item.createdAt}</TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  {item.isBought ? (
                    <>Bought by {item?.boughtBy?.username}</>
                  ) : (
                    <>
                      Not Bought{" "}
                      <Button onClick={() => {}}>
                        <ShoppingCart />
                      </Button>
                    </>
                  )}
                  {item.owner?._id === user?._id && (
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      <X />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default memo(GroupItems);
