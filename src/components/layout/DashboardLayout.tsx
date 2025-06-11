import { Link, Outlet, useNavigate } from "react-router-dom";
import { TruncatingNavbar as Navbar } from "../ui/truncating-navbar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Container from "../helpers/Container";
import { SearchComponent } from "../blocks/search-bar";
import { useEffect, useState } from "react";
import { baseApi } from "@/api/api";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "../ui/button";
import { ChevronsUpDown, Group, Plus, User } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import toast from "react-hot-toast";

// const routes = [
//   {
//     name: "",
//     link: "",
//     external: true,
//   },
//   {
//     name: "",
//     link: "https://maxim-bortnikov.netlify.app/",
//     external: true,
//   },
//   {
//     name: "Credit",
//     link: "https://ui.aceternity.com/components/resizable-navbar",
//     external: true,
//   },
// ];

const routes = [
  {
    name: "",
    link: "",
    external: false,
  },
];

const DashboardLayout = () => {
  const [data, setData] = useState([]);
  const { token } = useAuthStore();
  const [isSearchShow, setIsSearchShow] = useState<boolean>(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  if (!token) {
    navigate("/login");
  }

  useEffect(() => {
    baseApi
      .get("/groups", {
        headers: {
          "X-Auth-Token": token,
        },
      })
      .then((res) => setGroups(res.data))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSearch = (searchQ: string) => {
    console.log(searchQ);
    baseApi
      .get(`/groups/search?q=${searchQ}`, {
        headers: {
          "X-Auth-Token": token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(
          res.data.map(
            (item: { name: string; _id: string; owner: { name: string } }) => ({
              id: item._id,
              title: item.name,
              name: item.name,
              tags: [],
              creator: item.owner.name,
            })
          )
        );
      });
  };

  if (loading) {
    return <>loading...</>;
  }

  return (
    <div>
      <Container>
        <Navbar
          icon="https://raw.githubusercontent.com/Northstrix/namer-ui/refs/heads/main/public/logo.png"
          appName="Shopping List"
          routes={routes}
          homeRoute="https://namer-ui.netlify.app/"
          scrolledBg="var(--truncating-navbar-bg-scrolled)"
          mobileBg="var(--truncating-navbar-bg-mobile)"
          outlineColor="var(--truncating-navbar-outline)"
          searchPlaceholderText="Search..."
          shortcutKey="M"
          onOpenSearch={() => setIsSearchShow((p) => !p)}
          zIndex={1}
          defaultTextColor="var(--truncating-navbar-text)"
          hoverTextColor="var(--truncating-navbar-text-hover)"
          hoverBgColor="var(--truncating-navbar-bg-hover)"
          searchBtnBg="var(--truncating-navbar-search-bg)"
          searchBtnText="var(--truncating-navbar-search-text)"
          searchBtnOutline="var(--truncating-navbar-search-outline)"
          searchBtnHoverBg="var(--truncating-navbar-search-bg-hover)"
          searchBtnHoverText="var(--truncating-navbar-search-text-hover)"
          mobileMenuBg="var(--truncating-navbar-bg-mobile-menu)"
          mobileMenuText="var(--truncating-navbar-mobile-menu-text)"
          mobileMenuHoverBg="var(--truncating-navbar-mobile-menu-bg-hover)"
          mobileMenuHoverText="var(--truncating-navbar-mobile-menu-text-hover)"
          logoTextColor="var(--truncating-navbar-logo-text)"
          logoHoverColor="var(--truncating-navbar-logo-text-hover)"
        />
        {isSearchShow && (
          <SearchComponent data={data} onChange={handleSearch} />
        )}
      </Container>
      <SidebarProvider>
        <Sidebar className="px-3">
          <SidebarHeader className="flex">
            <h1 className="text-2xl">Shopping List</h1>
          </SidebarHeader>
          <SidebarContent>
            <Link to="/dashboard">
              <Button className="w-full">
                <User /> Profile
              </Button>
            </Link>
            <Collapsible defaultOpen>
              <div className="flex items-center justify-between gap-4 px-4">
                <h4 className="text-sm font-semibold flex items-center gap-1">
                  <Group /> Groups
                </h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <ChevronsUpDown />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="flex flex-col gap-2">
                <Button className="w-full">
                  <Plus /> Create group
                </Button>

                {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  groups.map((group: any) => (
                    <Link to={"/dashboard/group/" + group._id} key={group._id}>
                      <Button
                        variant="outline"
                        className="w-full cursor-pointer"
                      >
                        {group.name}
                      </Button>
                    </Link>
                  ))
                }
              </CollapsibleContent>
            </Collapsible>
          </SidebarContent>
          <SidebarFooter />
        </Sidebar>
        <main className="w-full">
          <Container>
            <SidebarTrigger />
            <Outlet />
          </Container>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
