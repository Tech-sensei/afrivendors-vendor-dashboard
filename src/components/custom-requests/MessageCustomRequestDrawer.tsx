"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSelector } from "react-redux";
import { useMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { getCustomRequestChannelId } from "@/lib/customRequestChannel";
import useStreamChat from "@/hooks/useStreamChat";
import {
  useCreateStreamChatChannel,
  useStreamChatToken,
} from "@/services/useStreamChat";
import type { VendorCustomRequest } from "@/types/vendorCustomRequests";
import { RootState } from "@/store/store";
import { ChatDrawerBody } from "@/components/messages/ChatDrawerBody";
import { CustomRequestMessagePlaceholder } from "./CustomRequestMessagePlaceholder";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  request: VendorCustomRequest | null;
};

export function MessageCustomRequestDrawer({ isOpen, onClose, request }: Props) {
  const isMobile = useMobile();
  const profile = useSelector((state: RootState) => state.auth.profile);
  const { data: userStreamChatToken } = useStreamChatToken();
  const { mutate: createStreamChatChannel, isPending: isCreatingChannel } =
    useCreateStreamChatChannel();
  const { instantiateUser, checkIfChannelExists } = useStreamChat();

  const [streamClientReady, setStreamClientReady] = useState(false);
  const [channelRecheckKey, setChannelRecheckKey] = useState(0);
  const [channelExists, setChannelExists] = useState<boolean | null>(null);

  useEffect(() => {
    if (!request || !isOpen) {
      setStreamClientReady(false);
      setChannelExists(null);
      return undefined;
    }

    const token = userStreamChatToken?.userChatToken;
    if (!token || !profile?.vendor?.id) {
      setStreamClientReady(false);
      setChannelExists(null);
      return undefined;
    }

    let cancelled = false;
    setStreamClientReady(false);

    const name =
      `${profile.vendor.firstName ?? ""} ${profile.vendor.lastName ?? ""}`.trim() ||
      "Vendor";

    void instantiateUser(profile.vendor.id, name, "", token).then(
      () => {
        if (!cancelled) setStreamClientReady(true);
      },
      () => {
        if (!cancelled) setStreamClientReady(false);
      },
    );

    return () => {
      cancelled = true;
      setStreamClientReady(false);
      setChannelExists(null);
    };
  }, [
    request,
    isOpen,
    userStreamChatToken?.userChatToken,
    profile?.vendor?.firstName,
    profile?.vendor?.lastName,
    profile?.vendor?.id,
    instantiateUser,
  ]);

  useEffect(() => {
    if (!isOpen || !request || !streamClientReady) {
      setChannelExists(null);
      return;
    }

    let cancelled = false;
    setChannelExists(null);

    const channelId = getCustomRequestChannelId(request.id);
    void (async () => {
      try {
        const exists = await checkIfChannelExists(channelId);
        if (!cancelled) setChannelExists(exists);
      } catch {
        if (!cancelled) setChannelExists(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    isOpen,
    request,
    streamClientReady,
    checkIfChannelExists,
    channelRecheckKey,
  ]);

  if (!request) return null;

  const handleCreateStreamChatChannel = () => {
    if (!request.customerUserId) return;

    createStreamChatChannel(
      {
        otherUserId: request.customerUserId,
        customRequestId: Number(request.id),
      },
      {
        onSuccess: () => {
          setChannelRecheckKey((k) => k + 1);
        },
      },
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[999] bg-secondary-000/40 backdrop-blur-[2px]"
          />

          <motion.div
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed z-[1000] flex flex-col overflow-hidden bg-[#F8F5F2] shadow-[-4px_0_24px_rgba(0,0,0,0.12)]",
              isMobile
                ? "bottom-0 left-0 right-0 h-[92vh] rounded-t-[24px]"
                : "top-0 right-0 bottom-0 w-full max-w-md rounded-l-[24px]",
            )}
          >
            {channelExists === null || !streamClientReady ? (
              <div className="flex min-h-0 flex-1 items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
              </div>
            ) : channelExists ? (
              <ChatDrawerBody
                onClose={onClose}
                channelId={getCustomRequestChannelId(request.id)}
              />
            ) : (
              <CustomRequestMessagePlaceholder
                request={request}
                onClose={onClose}
                onCreateChannel={handleCreateStreamChatChannel}
                disableCreate={isCreatingChannel}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
