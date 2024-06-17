import { MessagePayload } from "@/hooks/useWebsocket";

export type UIMessage = {
  /**
   * @unique
   */
  id: MessagePayload["user"]["id"];
  /**
   * Either AI or Human depending on who sent this message.
   */
  role: MessagePayload["user"]["role"];
  /**
   * When this message was sent, dateTime
   */
  sentAt: MessagePayload["sentAt"];
  /**
   * The full text, until now, of the message
   */
  text: string;
};
