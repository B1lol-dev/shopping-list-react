import { baseApi } from "@/api/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";
import { Plus } from "lucide-react";
import {
  memo,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import toast from "react-hot-toast";

interface IGroupItem {
  title: string;
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
      <div>
        {items.map((item) => (
          <div>{item?.title}</div>
        ))}
      </div>
    </div>
  );
};

export default memo(GroupItems);
