//get stream chat token

import http from "@/lib/http";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export enum PinAction {
  PIN = "pin",
  UNPIN = "unpin",
}

export const useStreamChatToken = () => {
  return useQuery({
    queryKey: ["stream-chat-token"],
    queryFn: async () => {
      const { data } = await http.get("/messages/stream-chat-token");
      return data;
    },
  });
};

//create stream chat channel

export const useCreateStreamChatChannel = () => {
  return useMutation({
    mutationFn: async (createChanneldata: {
      otherUserId: number;
      appointmentId: number;
    }) => {
      const { data } = await http.post(
        "/messages/create-channel",
        createChanneldata,
      );
      return data;
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to create stream chat channel. Please try again.",
      );
      console.log(error?.response?.data?.message);
    },
  });
};

//get pinned channels

export const useGetPinnedChannels = () => {
  return useQuery({
    queryKey: ["pinned-channels"],
    queryFn: async () => {
      const { data } = await http.get("/messages/pinned-channels");
      return data.pinnedChannels;
    },
  });
};

//pin channel

export const usePinChannel = () => {
  return useMutation({
    mutationFn: async (pinChannelData: {
      channelId: string;
      action: PinAction;
    }) => {
      const { data } = await http.post("/messages/pin-channel", pinChannelData);
      return data;
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to pin chat. Please try again.",
      );
    },
    onSuccess: () => {
      toast.success("chat pinned successfully");
    },
  });
};
