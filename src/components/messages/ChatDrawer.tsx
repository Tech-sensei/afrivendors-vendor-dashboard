"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { ChatDrawerBody } from "./ChatDrawerBody";
import type { Channel } from "stream-chat";

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Channel | null;
}

export function ChatDrawer({ isOpen, onClose, conversation }: ChatDrawerProps) {
  const isMobile = useMobile();

  if (!conversation) return null;

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
            <ChatDrawerBody
              onClose={onClose}
              channelId={String(conversation.id)}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
