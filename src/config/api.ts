export const API_URL = 'https://functions.poehali.dev/8555ac94-6715-45d9-8bf4-180be8a77aef';

export const api = {
  async getChats() {
    const response = await fetch(`${API_URL}?action=get_chats`);
    return response.json();
  },

  async getContacts() {
    const response = await fetch(`${API_URL}?action=get_contacts`);
    return response.json();
  },

  async getMessages(chatId: number) {
    const response = await fetch(`${API_URL}?action=get_messages&chat_id=${chatId}`);
    return response.json();
  },

  async sendMessage(chatId: number, text: string) {
    const response = await fetch(`${API_URL}?action=send_message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    return response.json();
  },
};
