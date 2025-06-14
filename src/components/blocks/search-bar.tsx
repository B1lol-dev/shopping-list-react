import { useEffect, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpAZ, ArrowDownAZ, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { baseApi } from "@/api/api";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface SearchItem {
  id: string;
  creator: string;
  title: string;
  description: string;
  tags: string[];
}

interface SearchComponentProps {
  data: SearchItem[];
  onChange?: (text: string) => void;
}

const SearchComponent = ({ data, onChange }: SearchComponentProps) => {
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const lowerCaseQuery = query.toLowerCase().trim();
    const results = data.filter((item) =>
      item.title.toLowerCase().includes(lowerCaseQuery)
    );

    if (sortOrder === "asc") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "desc") {
      results.sort((a, b) => b.title.localeCompare(a.title));
    }

    setFilteredData(results);
  }, [query, sortOrder, data]);

  const [password, setPassword] = useState<string>("");
  const [currentId, setCurrentId] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const handleJoin = () => {
    baseApi
      .post(
        `/groups/${currentId}/join`,
        {
          password,
        },
        {
          headers: {
            "X-Auth-Token": token,
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setIsOpen(false);
        navigate(`/dashboard/group/${res.data.group._id}`);
      });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4 fixed left-1/2 top-1/2 -translate-1/2 z-10">
      {/* Search Input and Sort Dropdown */}
      <div className="w-full md:w-[40%] max-w-lg flex flex-col sm:flex-row gap-4 bg-background">
        {/* Search Bar with Icon */}
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search groups..."
            autoFocus
            className="w-full pr-10"
            onChange={(e) => {
              setQuery(e.target.value);
              if (onChange) {
                onChange(e.target.value);
              }
            }}
            value={query}
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={18}
          />
        </div>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Sort by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => setSortOrder("asc")}
              className="flex justify-between items-center"
            >
              <span>Title Ascending</span>
              <ArrowUpAZ className="ml-2 h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortOrder("desc")}
              className="flex justify-between items-center"
            >
              <span>Title Descending</span>
              <ArrowDownAZ className="ml-2 h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search Results with Scroll */}
      <ScrollArea className="h-72 w-full md:w-[40%] max-w-lg border rounded-md bg-background">
        <div className="p-4 space-y-4">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-card text-card-foreground p-4 rounded-lg border shadow-sm flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-medium leading-none">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {item.description}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {item.creator}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-secondary text-secondary-foreground text-xs px-2.5 py-0.5 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setCurrentId(item.id);
                    setPassword("");
                    setIsOpen((p) => !p);
                  }}
                >
                  Join
                </Button>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No results found.
            </p>
          )}
        </div>
      </ScrollArea>

      {/* Dialog for joining group */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join to group</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              handleJoin();
            }}
          >
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="pass">Password</Label>
                <Input
                  id="pass"
                  name="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>
            <DialogFooter className="mt-3">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Join group</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { SearchComponent };
