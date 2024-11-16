import React from 'react';
import { Header } from '@/widgets/header/';
import { ChannelList } from '@/features/channels';
import { MessageInput, MessageList } from '@/features/messages';
import { UsersList } from '@/features/user-list';
import useSocket from '@/shared/hooks/useSocket';
import { Refetch, User } from '@/shared/type/index';

interface ChatPageProps {
  userData: User;
  refetch: Refetch;
}

const ChatPage: React.FC<ChatPageProps> = ({ userData, refetch }) => {
  const socketUrl = import.meta.env.VITE_SERVER_PORT;

  const {
    channels,
    messages,
    currentChannel,
    activeUsers,
    joinChannel,
    changeChannel,
    sendMessage,
    setChannels,
    createChannel,
    deleteUser,
  } = useSocket(socketUrl, userData);

  const isAdmin = channels.some(
    (ch) => ch.name === currentChannel && ch.userRole === 'admin',
  );

  const handleDeleteUser = (username: string) => {
    deleteUser(currentChannel, username, userData.id);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white  overflow-hidden">
      <Header userData={userData} refetch={refetch} />

      <div className="flex flex-1 ">
        <div className="w-1/4 bg-gray-800 border-r border-gray-700">
          <ChannelList
            currentChannel={currentChannel}
            userData={userData}
            channels={channels}
            joinChannel={joinChannel}
            changeChannel={changeChannel}
            setChannels={setChannels}
            createChannel={createChannel}
          />
        </div>

        <div className="flex-1 flex flex-col bg-gray-00 max-h-[90.5vh]">
          <MessageList messages={messages} currentChannel={currentChannel} />
          <div className="">
            <MessageInput
              currentChannel={currentChannel}
              sendMessage={sendMessage}
            />
          </div>
        </div>

        <div className="w-1/4 bg-gray-800  border-l border-gray-700">
          <UsersList
            activeUsers={activeUsers}
            currentChannel={currentChannel}
            userData={userData}
            isAdmin={isAdmin}
            onDeleteUser={handleDeleteUser}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
