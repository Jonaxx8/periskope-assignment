import { FC } from 'react';
import { FaCheck } from 'react-icons/fa';
import { IoIosSend } from "react-icons/io";


interface MessageBubbleProps {
  message: string;
  timestamp: string;
  sender: string;
  isOutgoing: boolean;
  phoneNumber?: string;
  avatarColor: string;
}

const MessageBubble: FC<MessageBubbleProps> = ({
  message,
  timestamp,
  sender,
  isOutgoing,
  phoneNumber,
  avatarColor,
}) => {
  return (
    <div
      className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} mb-4 drop-shadow-sm`}
    >
      {!isOutgoing && <div className="flex space-x-4 mr-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white ${avatarColor}`}>
          {sender[0].toUpperCase()}
        </div>
      </div>}
      <div
        className={`min-w-[220px] px-3 py-2 relative ${
          isOutgoing
            ? 'bg-[#e7ffdb] text-gray-800 rounded-tl-xl rounded-tr-xl rounded-bl-xl'
            : 'bg-white text-gray-800 rounded-tr-xl rounded-tl-xl rounded-br-xl'
        }`}
      >
        {!isOutgoing ? (
          <div className="mb-1 flex justify-between">
            <div className="text-xs font-semibold text-green-500">
              {sender}
            </div>
            {phoneNumber ? (
              <div className="text-[0.6875rem] text-gray-500">
                {phoneNumber}
              </div>
            ) : (
              <div className="text-[0.6875rem] text-gray-400">
                +91 88978 97897
              </div>
            )}
          </div>
        ) : (
          <div className="mb-1 flex justify-between text-xs">
            <div className="text-xs font-semibold text-green-700">
              Periscope
            </div>
            <span className="text-gray-400 ">+91 98765 43210</span>
          </div>
        )}
        <div className="text-[0.9375rem] leading-[1.4]">{message}</div>
        <div className={`flex items-center justify-between mt-1 space-x-1.5`}>
          {isOutgoing && 
          <span className="flex items-center justify-start text-[10px] text-gray-400 text-left mr-2">
            <IoIosSend className="mr-1" size={11} />
            <span className="text-gray-400">bharath@hashlabs.com</span>
          </span>}
          <span className={`text-[0.6875rem] text-gray-400 ml-auto`}>{timestamp}</span>
          {isOutgoing && (
            <div className="flex items-center">
              <FaCheck className="text-[#53bdeb]" size={11} />
              <FaCheck className="text-[#53bdeb] -ml-1.5" size={11} />
            </div>
          )}
        </div>
        {/* Message tail */}
        <div
          className={`absolute top-0 ${
            isOutgoing
              ? '-right-2 border-[#e7ffdb]'
              : '-left-2 border-white'
          } w-4 h-4 border-t-8 border-r-8 border-l-0 border-b-0 border-solid transform ${
            isOutgoing ? 'rotate-[135deg]' : 'rotate-45'
          }`}
        />
      </div>
    </div>
  );
};

export default MessageBubble; 