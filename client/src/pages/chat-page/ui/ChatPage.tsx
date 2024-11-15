import React from 'react';
import { Header } from '@/widgets/header/';
import { ChannelList } from '@/features/channels';
import { MessageInput, MessageList } from '@/features/messages';
import useSocket from '@/features/socket/hooks/useSocket';
import { Refetch, User } from '@/shared/type/index';

interface ChatPageProps {
  userData: User;
  refetch: Refetch;
}

const ChatPage: React.FC<ChatPageProps> = ({ userData, refetch }) => {
  const socketUrl = import.meta.env.VITE_DEV_PORT;

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
  let isAdmin: boolean;

  channels.map((ch) => {
    if (ch.name == currentChannel) {
      isAdmin = ch.userRole == 'admin';
    }
  });

  const handleDeleteUser = (username: string) => {
    deleteUser(currentChannel, username, userData.id);
  };

  return (
    <div>
      <Header userData={userData} refetch={refetch} />
      <ChannelList
        currentChannel={currentChannel}
        userData={userData}
        channels={channels}
        joinChannel={joinChannel}
        changeChannel={changeChannel}
        setChannels={setChannels}
        createChannel={createChannel}
      />
      <h2>Active Users on {currentChannel}</h2>
      <ul>
        {activeUsers.map((username) => (
          <li key={username}>
            {username}
            {username !== userData.username && isAdmin && (
              <button onClick={() => handleDeleteUser(username)}>Remove</button>
            )}
          </li>
        ))}
      </ul>
      <MessageList messages={messages} />
      <MessageInput
        currentChannel={currentChannel}
        username={userData.username}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default ChatPage;
