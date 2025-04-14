import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import PersonPinOutlinedIcon from "@mui/icons-material/PersonPinOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";

const navList_1 = [
  {
    id: 234,
    text: "Dashboard",
    icon: HomeOutlinedIcon,
    link: "/dashboard",
  },
  {
    id: 466,
    text: "Trò Chuyện",
    icon: TextsmsOutlinedIcon,
    link: "/chat_generator",
  },
  {
    id: 346,
    text: "Quản Lý Tri Thức",
    icon: StorageOutlinedIcon,
    link: "/knowledge_bases",
  },
];
const navList_2 = [
  // {
  //   id: 355,
  //   text: "Cài Đặt",
  //   icon: SettingsOutlinedIcon,
  //   link: "/setting",
  // },
  {
    id: 242,
    text: "Quản Lý Mô Hình",
    icon: PsychologyAltIcon,
    link: "/models_manager",
  },
  {
    id: 674,
    text: "Quản Lý Tài Khoản",
    icon: PersonPinOutlinedIcon,
    link: "/user_accounts",
  },
];

export { navList_1, navList_2 };
