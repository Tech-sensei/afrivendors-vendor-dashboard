import { useCallback } from "react";
import streamChat from "@/lib/streamChat";

const useStreamChat = () => {
  //instantiate user
  const instantiateUser = useCallback(
    async (
      userId: string | number,
      userName: string,
      userImage: string,
      userToken: string,
    ) => {
      // JWT payload user_id is a string; Stream compares with strict equality (42 !== "42").
      const nextId = String(userId);
      // Make navigation-safe: don't reconnect if already connected as same user.
      // Avoids races where another page disconnected the singleton client.
      if (streamChat.userID && String(streamChat.userID) === nextId) return;
      if (streamChat.userID && String(streamChat.userID) !== nextId) {
        await streamChat.disconnectUser();
      }
      await streamChat.connectUser(
        {
          id: nextId,
          name: userName,
          image: userImage,
        },
        userToken,
      );
    },
    [],
  );

  //disconnect user
  const disconnectUser = useCallback(async () => {
    await streamChat.disconnectUser();
  }, []);

  //check if channel exists
  const checkIfChannelExists = useCallback(async (channelId: string) => {
    const channels = await streamChat.queryChannels({
      type: "messaging",
      id: channelId,
    });

    if (channels.length > 0) {
      return true;
    }
    return false;
  }, []);

  //get channel message
  const getChannelMessages = useCallback(async (channelId: string) => {
    const channel = streamChat.channel("messaging", channelId);

    const response = await channel.query({
      watch: true,
      state: true,
      presence: true,
      messages: {
        limit: 1000,
        offset: 0,
      },
    });

    await channel.markRead();

    return response;
  }, []);

  //get all channels a user is part of
  const getAllChannels = useCallback(async (userId: string) => {
    const channels = await streamChat.queryChannels(
      { members: { $in: [userId] } },
      { last_message_at: -1 },
      { limit: 20, offset: 0 },
    );
    if (channels.length > 0) {
      return channels;
    }
    return [];
  }, []);

  //send message
  const sendMessage = useCallback(
    async (channelId: string, message: string) => {
      const channel = streamChat.channel("messaging", channelId);
      await channel.sendMessage({
        text: message,
      });
    },
    [],
  );

  return {
    instantiateUser,
    disconnectUser,
    checkIfChannelExists,
    getChannelMessages,
    getAllChannels,
    sendMessage,
  };
};

export default useStreamChat;
