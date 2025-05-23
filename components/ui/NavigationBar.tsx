import { FC } from 'react';
import {
  FaChartLine,
  FaList,
  FaBullhorn,
  FaCog,
} from 'react-icons/fa';
import { TiHome } from "react-icons/ti";
import { AiFillMessage } from "react-icons/ai";
import { BiSolidCoupon } from "react-icons/bi";
import { IoGitNetworkOutline } from "react-icons/io5";
import { RiContactsBookFill } from "react-icons/ri";
import { RiFolderImageFill } from "react-icons/ri";
import { FaTasks } from "react-icons/fa";
import { GiStarsStack } from "react-icons/gi";
import { RiLogoutBoxRLine } from "react-icons/ri";

import Image from 'next/image';
import logo from '../../public/logos/image.png';
import { signOutAction } from '@/app/actions';

interface NavigationBarProps {
  activeItem?: string;
  onItemSelect?: (item: string) => void;
}

const NavigationBar: FC<NavigationBarProps> = ({ activeItem, onItemSelect }) => {
  const navGroups = [
    [
      { id: 'home', icon: TiHome },
    ],
    [
      { id: 'messages', icon: AiFillMessage },
      { id: 'coupons', icon: BiSolidCoupon },
      { id: 'analytics', icon: FaChartLine },
    ],
    [
      { id: 'menu', icon: FaList },
      { id: 'announcements', icon: FaBullhorn },
      { id: 'version-control', icon: IoGitNetworkOutline },
    ],
    [
      { id: 'teams', icon: RiContactsBookFill },
      { id: 'documents', icon: RiFolderImageFill },
    ],
    [
      { id: 'tasks', icon: FaTasks },
      { id: 'settings', icon: FaCog },
    ],
  ];

  return (
    <nav className="w-12 bg-white border-r flex flex-col h-screen">
      {/* Logo area */}
      <div className="p-2 flex justify-center items-center">
        <div className="w-8 h-8 rounded-sm flex items-center justify-center">
          <Image src={logo} alt="logo"/>
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex-1 py-2">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="relative">
            <div className="space-y-1 py-2">
              {group.map((item) => {
                const isActive = activeItem === item.id;
                const isMessages = item.id === 'messages';
                return (
                  <button
                    key={item.id}
                    onClick={() => onItemSelect?.(item.id)}
                    className={`w-full p-2 flex justify-center items-center hover:bg-gray-100 ${
                      isActive || (isMessages && !activeItem) ? 'text-green-600' : 'text-gray-600'
                    }`}
                  >
                    <item.icon size={20} />
                  </button>
                );
              })}
            </div>
            {groupIndex < navGroups.length - 1 && (
              <div className="border-b border-gray-200 mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Settings at bottom */}
      <div className="p-2 border-t">
        <button className="w-full p-1 flex justify-center items-center text-gray-600 hover:bg-gray-100">
          <GiStarsStack size={30} />
        </button>
        <button className="w-full p-1 flex justify-center items-center text-gray-600 hover:bg-gray-100" onClick={() => signOutAction()}>
          <RiLogoutBoxRLine size={30} />
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;
