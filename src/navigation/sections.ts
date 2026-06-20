import type { IconType } from "react-icons";
import { FaUserFriends } from "react-icons/fa";
import { RiGroup2Line } from "react-icons/ri";
import { MdAdminPanelSettings } from "react-icons/md";

export interface Section {
  label: string;
  cardText: string;
  path: string;
  icon: IconType;
  variant: string;
  adminOnly?: boolean;
}

export const sections: Section[] = [
  {
    label: "Friends",
    cardText: "Manage Friends",
    path: "/friends",
    icon: FaUserFriends,
    variant: "menu1",
  },
  {
    label: "Groups",
    cardText: "Manage Groups",
    path: "/groups",
    icon: RiGroup2Line,
    variant: "menu2",
  },
  {
    label: "Admin",
    cardText: "Admin",
    path: "/admin",
    icon: MdAdminPanelSettings,
    variant: "menu3",
    adminOnly: true,
  },
];
