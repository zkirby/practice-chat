export interface Message {
  role: "ai" | "user";
  content: string;
  sentAt: Date;
}
