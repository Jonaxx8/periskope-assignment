import { FC } from 'react';

interface PlaceholderContentProps {
  section: string;
}

const PlaceholderContent: FC<PlaceholderContentProps> = ({ section }) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-2xl text-gray-400 font-medium">
        {section.charAt(0).toUpperCase() + section.slice(1)} Section
      </div>
    </div>
  );
};

export default PlaceholderContent; 