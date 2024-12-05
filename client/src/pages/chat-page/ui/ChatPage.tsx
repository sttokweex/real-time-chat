import React from 'react';
import { ChannelList } from '@/widgets/channel-list';
import { Header } from '@/widgets/header/';
import { MessageArea } from '@/widgets/message-area';
import { UsersList } from '@/widgets/user-list';
import useSocket from '@/shared/hooks/useSocket';
import { Refetch, User } from '@/shared/types';

interface ChatPageProps {
  userData: User;
  refetch: Refetch;
}

const ChatPage: React.FC<ChatPageProps> = ({ userData, refetch }) => {
const socketUrl = 'http://79.141.65.250/socket.io';

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
        <MessageArea
          messages={messages}
          currentChannel={currentChannel}
          sendMessage={sendMessage}
        />
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
