export type ConversationUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
};

export type SupportMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    fullName: string;
    avatar: string | null;
    role: string;
  };
};

export type SupportConversation = {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: ConversationUser;
  messages: SupportMessage[];
};
