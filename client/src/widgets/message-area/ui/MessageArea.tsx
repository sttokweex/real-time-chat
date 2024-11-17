import { MessageInput, MessageList } from '@/features/messages';
import { Message } from '@/shared/type';

interface MessageAreaProps {
  messages: Message[];
  currentChannel: string;
  sendMessage: (message: string) => void;
}
const MessageArea: React.FC<MessageAreaProps> = ({
  messages,
  currentChannel,
  sendMessage,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-gray-00 max-h-[90.5vh]">
      <MessageList messages={messages} currentChannel={currentChannel} />
      <div className="">
        <MessageInput
          currentChannel={currentChannel}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};
export default MessageArea;
