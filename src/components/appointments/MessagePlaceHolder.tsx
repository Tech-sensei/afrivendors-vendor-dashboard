"use client";

import { useRef } from "react";
import { X, Send, Paperclip } from "lucide-react";
import { VendorAppointment } from "@/types/appointments";
import { Button } from "@/components/ui/button";

interface MessagePlaceholderProps {
    onClose: () => void;
    appointment: VendorAppointment | null;
    /** When true, show a CTA to create the Stream channel (matches client `MessagingPlaceholderSheet` flow). */
    showCreateChannelCta?: boolean;
    onCreateChannel?: () => void;
}

export const  MessagePlaceholder = ({
    onClose,
    appointment,
    showCreateChannelCta = false,
    onCreateChannel,
}: MessagePlaceholderProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    if (!appointment) return null;

    const initials = `${appointment.user.firstName[0] ?? ""}${appointment.user.lastName[0] ?? ""}`;
    const subtitle = appointment.services[0]?.serviceName ?? "";

    return (
        <>
            <div className="px-6 py-4 border-b border-accent-20 bg-white shrink-0 flex flex-row items-center gap-3 shadow-sm">
                <button
                    type="button"
                    onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary-300/10 hover:bg-secondary-300/20 transition-colors shrink-0 -ml-1"
                    aria-label="Close"
                >
                    <X className="w-4 h-4 text-secondary-000" />
                </button>
                <div className="flex flex-1 items-center gap-3 min-w-0 text-left">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden shrink-0 border border-border/50">
                        {appointment.user.profilePhoto ? (
                            <img
                                src={appointment.user.profilePhoto}
                                alt={appointment.customerName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="font-unbounded text-sm font-semibold text-white">
                                {initials}
                            </span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-unbounded text-base font-bold text-secondary-000 truncate">
                            {appointment.customerName}
                        </p>
                        <p className="font-unageo text-xs text-secondary-300 font-medium truncate">
                            {subtitle}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F5F2]">
                <div className="flex justify-center my-4">
                    <span className="text-xs text-secondary-300/60 bg-white/50 px-3 py-1 rounded-full font-unageo">
                        Today
                    </span>
                </div>

                <div className="mx-auto mt-8 max-w-xs rounded-2xl bg-white p-4 text-center shadow-sm border border-accent-20">
                    {showCreateChannelCta ? (
                        <>
                            <p className="text-sm font-medium text-secondary-000 mb-2 font-unbounded">
                                Start a conversation
                            </p>
                            <p className="text-xs text-secondary-300 leading-relaxed font-unageo">
                                No chat for this booking yet. Create the channel to message{" "}
                                {appointment.customerName} here.
                            </p>
                            <div className="mt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="font-unageo"
                                    onClick={onCreateChannel}
                                >
                                    Chat with{" "}
                                    {appointment.customerName.split(" ")[0] ?? "customer"}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-sm font-medium text-secondary-000 mb-2 font-unbounded">
                                In-app messaging is not available yet.
                            </p>
                            <p className="text-xs text-secondary-300 leading-relaxed font-unageo">
                                You can still reach {appointment.customerName} using the contact
                                options on this booking. Messaging will be enabled here in a
                                future update.
                            </p>
                        </>
                    )}
                </div>
                <div ref={messagesEndRef} />
            </div>

            <div className="shrink-0 p-4 bg-white border-t border-accent-20">
                <div className="flex w-full items-end gap-2 bg-[#F8F5F2] p-2 rounded-3xl border border-transparent opacity-60">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-full shrink-0"
                        disabled
                    >
                        <Paperclip className="h-4 w-4" />
                    </Button>
                    <textarea
                        readOnly
                        placeholder="Messaging unavailable"
                        rows={1}
                        disabled
                        className="flex-1 min-h-[40px] max-h-[120px] bg-transparent border-0 font-unageo text-sm resize-none placeholder:text-secondary-300/60 opacity-90"
                    />
                    <Button
                        type="button"
                        size="icon-sm"
                        className="rounded-full shrink-0"
                        disabled
                    >
                        <Send className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </>
    );
}
