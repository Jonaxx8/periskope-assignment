import { FC } from 'react';
import { FaCheck } from 'react-icons/fa';

interface MessageBubbleProps {
  message: string;
  timestamp: string;
  sender: string;
  isOutgoing: boolean;
}

const MessageBubble: FC<MessageBubbleProps> = ({
  message,
  timestamp,
  sender,
  isOutgoing,
}) => {
  return (
    <div
      className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isOutgoing
            ? 'bg-[#dcf8c6] text-gray-800'
            : 'bg-white text-gray-800'
        }`}
      >
        {!isOutgoing && (
          <div className="text-sm font-medium text-green-600 mb-1">
            {sender}
          </div>
        )}
        <div className="text-sm">{message}</div>
        <div className="flex items-center justify-end mt-1 space-x-1">
          <span className="text-xs text-gray-500">{timestamp}</span>
          {isOutgoing && (
            <FaCheck className="text-green-500" size={12} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble; 