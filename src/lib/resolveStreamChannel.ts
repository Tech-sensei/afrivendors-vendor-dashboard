import type { Channel } from "stream-chat";

function channelData(channel: Channel): Record<string, unknown> {
  const data = (channel as { data?: Record<string, unknown> }).data;
  return data && typeof data === "object" ? data : {};
}

/** Match a notification `itemId` to a Stream channel the vendor is a member of. */
export function findChannelForNotificationItem(
  channels: Channel[],
  itemId: number
): Channel | undefined {
  const idStr = String(itemId);
  const idCandidates = new Set([
    idStr,
    `appointment-${itemId}`,
    `conversation-${itemId}`,
    `chat-${itemId}`,
  ]);

  return channels.find((channel) => {
    const cid = String(channel.id ?? "");
    if (idCandidates.has(cid)) return true;

    const data = channelData(channel);
    const appointmentId = data.appointmentId ?? data.appointment_id;
    const conversationId = data.conversationId ?? data.conversation_id;

    return (
      appointmentId === itemId ||
      appointmentId === idStr ||
      conversationId === itemId ||
      conversationId === idStr ||
      data.id === itemId ||
      data.id === idStr
    );
  });
}
