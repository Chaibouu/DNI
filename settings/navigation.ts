export interface ChildrenItem {
  title: string;
  path: string;
  allowedRoles: string[];
}
export interface NavigationItem {
  title: string;
  icon: string;
  path: string;
  children?: ChildrenItem[];
  allowedRoles: string[];
}

export const adminNavigation: NavigationItem[] = [
  {
    title: "Dashboard",
    icon: "material-symbols:dashboard",
    path: "/dashboard",
    allowedRoles: ["USER","ADMIN"],
  },
  {
    title: "Participants",
    icon: "material-symbols:groups",
    path: "/participants",
    allowedRoles: ["USER","ADMIN"],
  },
  {
    title: "Paramètres",
    icon: "material-symbols:settings",
    path: "/dashboard/settings",
    allowedRoles: ["ADMIN","USER"],
  },
];
