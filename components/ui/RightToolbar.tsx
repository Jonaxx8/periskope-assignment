import { FC } from 'react';
import { FiRefreshCw } from "react-icons/fi";
import { LuPenLine } from "react-icons/lu";
import { CiMenuFries } from "react-icons/ci";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { PiAtThin } from "react-icons/pi";
import { RiFolderImageFill } from "react-icons/ri";
import { RiListSettingsLine } from "react-icons/ri";
import { MdOutlineSensorDoor } from "react-icons/md";
import { MdGroups } from 'react-icons/md';

const RightToolbar: FC = () => {
  const toolbarItems = [
    { icon: MdOutlineSensorDoor, label: 'Search' },
    { icon: FiRefreshCw, label: 'History' },
    { icon: LuPenLine, label: 'Edit' },
    { icon: CiMenuFries, label: 'Files' },
    { icon: HiOutlineViewGridAdd, label: 'Media' },
    { icon: MdGroups, label: 'Groups' },
    { icon: PiAtThin, label: 'Starred' },
    { icon: RiFolderImageFill, label: 'Mail' },
    { icon: RiListSettingsLine, label: 'Settings' },
  ];

  return (
    <div className="w-14 bg-white border-l flex flex-col h-full">
      <div className="flex-1 flex flex-col space-y-5 py-6">
        {toolbarItems.map((item, index) => (
          <button
            key={index}
            className="w-full h-6 flex items-center justify-center text-gray-400 hover:text-gray-800"
            title={item.label}
          >
            <item.icon size={16} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RightToolbar; 