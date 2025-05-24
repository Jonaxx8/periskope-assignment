import { FC } from 'react';
import { LuRefreshCcwDot } from "react-icons/lu";
import { IoHelpCircleOutline } from 'react-icons/io5';
import { HiDotsVertical } from 'react-icons/hi';
import { AiFillMessage } from "react-icons/ai";
import { TiHome } from "react-icons/ti";
import { BiSolidCoupon } from "react-icons/bi";
import { FaChartLine, FaList, FaBullhorn, FaTasks, FaCog } from 'react-icons/fa';
import { IoGitNetworkOutline } from "react-icons/io5";
import { RiContactsBookFill, RiFolderImageFill } from "react-icons/ri";
import { FaCircle } from "react-icons/fa6";
import { HiOutlineSelector } from "react-icons/hi";
import { MdOutlineInstallDesktop } from "react-icons/md";
import { FaBellSlash } from "react-icons/fa6";
import { TfiMenuAlt } from "react-icons/tfi";
import { BsStars } from "react-icons/bs";

interface TopBarProps {
  activeSection: string;
  onRefresh?: () => void;
  onHelp?: () => void;
}

const TopBar: FC<TopBarProps> = ({ activeSection, onRefresh, onHelp }) => {
  const sectionIcons: { [key: string]: any } = {
    home: TiHome,
    messages: AiFillMessage,
    coupons: BiSolidCoupon,
    analytics: FaChartLine,
    menu: FaList,
    announcements: FaBullhorn,
    'version-control': IoGitNetworkOutline,
    teams: RiContactsBookFill,
    documents: RiFolderImageFill,
    tasks: FaTasks,
    settings: FaCog,
  };

  const Icon = sectionIcons[activeSection] || AiFillMessage;
  const sectionTitle = activeSection === 'version-control' ? 'Version Control' : 
    activeSection.charAt(0).toUpperCase() + activeSection.slice(1);

  return (
    <div className="h-12 bg-white border-b flex items-center justify-between px-6 py-2">
      <div className="flex items-center space-x-2 text-gray-600">
        <Icon size={16} className={activeSection === 'messages' ? 'text-green-600' : ''} />
        <span className="text-sm">{sectionTitle}</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <button 
          onClick={onRefresh}
          className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-100 rounded text-sm border"
        >
          <LuRefreshCcwDot size={16} />
          <span>Refresh</span>
        </button>
        
        <button 
          onClick={onHelp}
          className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-100 rounded text-sm border"
        >
          <IoHelpCircleOutline size={16} />
          <span>Help</span>
        </button>
        
        <div className="flex items-center space-x-1 text-gray-600 border rounded py-1 px-2">
          <div className="w-4 h-4 bg-yellow-200 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-yellow-400"><FaCircle size={10} /></span>
          </div>
          <span className="text-sm font-medium">5 / 6 phones</span>
          <div className="w-4 h-4  rounded-full flex items-center justify-center ml-1">
            <HiOutlineSelector />
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button className="p-2 hover:bg-gray-100 rounded text-gray-600 border">
            <MdOutlineInstallDesktop size={16} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-gray-600 border">
            <FaBellSlash size={16} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-gray-600 border flex">
            <BsStars size={14} color='#FFD700' />
            <TfiMenuAlt size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;