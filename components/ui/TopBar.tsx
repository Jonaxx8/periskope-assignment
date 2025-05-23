import { FC } from 'react';
import { IoRefreshOutline } from 'react-icons/io5';
import { IoHelpCircleOutline } from 'react-icons/io5';
import { BsPhone } from 'react-icons/bs';
import { IoSettingsOutline } from 'react-icons/io5';
import { IoNotificationsOutline } from 'react-icons/io5';
import { HiDotsVertical } from 'react-icons/hi';
import { AiFillMessage } from "react-icons/ai";
import { TiHome } from "react-icons/ti";
import { BiSolidCoupon } from "react-icons/bi";
import { FaChartLine, FaList, FaBullhorn, FaTasks, FaCog } from 'react-icons/fa';
import { IoGitNetworkOutline } from "react-icons/io5";
import { RiContactsBookFill, RiFolderImageFill } from "react-icons/ri";

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
    <div className="h-16 bg-white border-b flex items-center justify-between px-6 py-2">
      <div className="flex items-center space-x-2 text-gray-600">
        <Icon size={16} className={activeSection === 'messages' ? 'text-green-600' : ''} />
        <span className="text-sm">{sectionTitle}</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={onRefresh}
          className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600"
        >
          <IoRefreshOutline size={20} />
        </button>
        
        <button 
          onClick={onHelp}
          className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600"
        >
          <IoHelpCircleOutline size={20} />
        </button>
        
        <div className="flex items-center space-x-1 text-gray-600">
          <BsPhone size={16} />
          <span className="text-sm font-medium">5 / 6 phones</span>
          <span className="text-xs text-gray-400 ml-1">⌀</span>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600">
            <IoSettingsOutline size={20} />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600">
            <IoNotificationsOutline size={20} />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600">
            <HiDotsVertical size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 