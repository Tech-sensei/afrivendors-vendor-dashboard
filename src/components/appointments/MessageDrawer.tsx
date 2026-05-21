"use client";

import { motion, AnimatePresence } from "motion/react";
import { VendorAppointment } from "@/types/appointments";
import { useMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { MessagePlaceholder } from "./MessagePlaceholder";
import {
  useCreateStreamChatChannel,
  useStreamChatToken,
} from "@/services/useStreamChat";
import { useCallback, useEffect, useState } from "react";
import useStreamChat from "@/hooks/useStreamChat";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { VendorGalleryItem } from "@/types/auth";
import { ChatDrawerBody } from "../messages/ChatDrawerBody";
import { Loader2 } from "lucide-react";

interface MessageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: VendorAppointment | null;
}

function getBannerImageUrl(gallery: VendorGalleryItem[] | undefined) {
  const banner = gallery?.find((item) => item.isBanner === true);
  return banner ? banner.imageUrl : null;
}

export function MessageDrawer({
  isOpen,
  onClose,
  appointment,
}: MessageDrawerProps) {
  const isMobile = useMobile();
  const profile = useSelector((state: RootState) => state.auth.profile);

  const { data: userStreamChatToken } = useStreamChatToken();
  const { mutate: createStreamChatChannel } = useCreateStreamChatChannel();
  const { instantiateUser, checkIfChannelExists } = useStreamChat();
  const [streamClientReady, setStreamClientReady] = useState(false);
  const [channelRecheckKey, setChannelRecheckKey] = useState(0);
  const [channelExists, setChannelExists] = useState<boolean | null>(null);

  useEffect(() => {
    if (!appointment) {
      setStreamClientReady(false);
      setChannelExists(null);
      return undefined;
    }

    const token = userStreamChatToken?.userChatToken;
    if (!token) {
      setStreamClientReady(false);
      setChannelExists(null);
      return undefined;
    }

    let cancelled = false;
    setStreamClientReady(false);

    const name =
      `${profile?.vendor.firstName ?? ""} ${profile?.vendor.lastName ?? ""}`.trim() ||
      `${appointment.vendor.firstName} ${appointment.vendor.lastName}`;
    const image = getBannerImageUrl(profile?.gallery);

    void instantiateUser(appointment.vendor.id, name, image ?? "", token).then(
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
    appointment,
    userStreamChatToken?.userChatToken,
    profile?.vendor.firstName,
    profile?.vendor.lastName,
    profile?.gallery,
    instantiateUser,
  ]);

  useEffect(() => {
    if (!isOpen || !appointment || !streamClientReady) {
      setChannelExists(null);
      return;
    }

    let cancelled = false;
    setChannelExists(null);

    const channelId = `appointment-${appointment.id}`;
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
    appointment,
    streamClientReady,
    checkIfChannelExists,
    channelRecheckKey,
  ]);

  if (!appointment) return null;

  const handleCreateStreamChatChannel = () => {
    createStreamChatChannel(
      {
        otherUserId: appointment.user.id,
        appointmentId: appointment.id,
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
            className="fixed inset-0 bg-secondary-000/40 backdrop-blur-[2px] z-999"
          />

          <motion.div
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed z-1000 flex flex-col overflow-hidden bg-[#F8F5F2] shadow-[-4px_0_24px_rgba(0,0,0,0.12)]",
              isMobile
                ? "bottom-0 left-0 right-0 h-[92vh] rounded-t-[24px]"
                : "top-0 right-0 bottom-0 w-full max-w-md rounded-l-[24px]",
            )}
          >
            {channelExists === null ? (
              <div className="flex flex-1 min-h-0 items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
              </div>
            ) : channelExists ? (
              <ChatDrawerBody
                onClose={onClose}
                channelId={`appointment-${appointment.id}`}
              />
            ) : (
              <MessagePlaceholder
                appointment={appointment}
                onClose={onClose}
                showCreateChannelCta
                onCreateChannel={handleCreateStreamChatChannel}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
