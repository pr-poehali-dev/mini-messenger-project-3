import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  initials: string;
}

interface Chat {
  id: number;
  contact: Contact;
  lastMessage: string;
  time: string;
  unread: number;
}

interface GalleryItem {
  id: number;
  url: string;
  type: 'image' | 'video';
  date: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const contacts: Contact[] = [
    { id: 1, name: 'Мама', avatar: '', status: 'online', initials: 'М' },
    { id: 2, name: 'Папа', avatar: '', status: 'online', initials: 'П' },
    { id: 3, name: 'Сестра Аня', avatar: '', status: 'offline', initials: 'А' },
    { id: 4, name: 'Брат Саша', avatar: '', status: 'online', initials: 'С' },
    { id: 5, name: 'Бабушка', avatar: '', status: 'offline', initials: 'Б' },
  ];

  const chats: Chat[] = [
    {
      id: 1,
      contact: contacts[0],
      lastMessage: 'Не забудь позвонить после работы!',
      time: '14:23',
      unread: 2,
    },
    {
      id: 2,
      contact: contacts[1],
      lastMessage: 'Договорились на воскресенье',
      time: '12:45',
      unread: 0,
    },
    {
      id: 3,
      contact: contacts[2],
      lastMessage: 'Спасибо за подарок! 💝',
      time: 'Вчера',
      unread: 1,
    },
    {
      id: 4,
      contact: contacts[3],
      lastMessage: 'Посмотрел тот фильм, классный!',
      time: 'Вчера',
      unread: 0,
    },
  ];

  const gallery: GalleryItem[] = [
    { id: 1, url: '/placeholder.svg', type: 'image', date: '15 дек' },
    { id: 2, url: '/placeholder.svg', type: 'image', date: '10 дек' },
    { id: 3, url: '/placeholder.svg', type: 'video', date: '5 дек' },
    { id: 4, url: '/placeholder.svg', type: 'image', date: '1 дек' },
    { id: 5, url: '/placeholder.svg', type: 'image', date: '28 ноя' },
    { id: 6, url: '/placeholder.svg', type: 'video', date: '20 ноя' },
  ];

  const currentUser = {
    name: 'Вы',
    email: 'you@family.com',
    avatar: '',
    initials: 'Я',
  };

  const messages = selectedChat
    ? [
        { id: 1, text: 'Привет! Как дела?', sent: false, time: '14:20' },
        { id: 2, text: 'Всё отлично! У тебя как?', sent: true, time: '14:21' },
        { id: 3, text: 'Не забудь позвонить после работы!', sent: false, time: '14:23' },
      ]
    : [];

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
            <div className="px-4 py-4">
              <h1 className="text-2xl font-semibold mb-4 text-foreground">Семейный чат</h1>
              <TabsList className="w-full grid grid-cols-5 h-auto p-1 bg-card">
                <TabsTrigger value="chats" className="flex flex-col items-center gap-1 py-2">
                  <Icon name="MessageCircle" size={20} />
                  <span className="text-xs">Чаты</span>
                </TabsTrigger>
                <TabsTrigger value="contacts" className="flex flex-col items-center gap-1 py-2">
                  <Icon name="Users" size={20} />
                  <span className="text-xs">Контакты</span>
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex flex-col items-center gap-1 py-2">
                  <Icon name="Images" size={20} />
                  <span className="text-xs">Галерея</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex flex-col items-center gap-1 py-2">
                  <Icon name="User" size={20} />
                  <span className="text-xs">Профиль</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex flex-col items-center gap-1 py-2">
                  <Icon name="Settings" size={20} />
                  <span className="text-xs">Настройки</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="px-4 py-4">
            <TabsContent value="chats" className="mt-0 animate-fade-in">
              {!selectedChat ? (
                <div className="space-y-2">
                  {chats.map((chat) => (
                    <Card
                      key={chat.id}
                      className="p-4 cursor-pointer hover:bg-accent/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      onClick={() => setSelectedChat(chat.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-14 h-14">
                            <AvatarImage src={chat.contact.avatar} />
                            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                              {chat.contact.initials}
                            </AvatarFallback>
                          </Avatar>
                          {chat.contact.status === 'online' && (
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-foreground">{chat.contact.name}</h3>
                            <span className="text-xs text-muted-foreground">{chat.time}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                            {chat.unread > 0 && (
                              <Badge className="ml-2 bg-secondary text-secondary-foreground">
                                {chat.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="animate-slide-in-right">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedChat(null)}
                    className="mb-4"
                  >
                    <Icon name="ArrowLeft" size={20} className="mr-2" />
                    Назад
                  </Button>
                  <Card className="h-[calc(100vh-280px)] flex flex-col">
                    <div className="p-4 border-b flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={chats.find((c) => c.id === selectedChat)?.contact.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {chats.find((c) => c.id === selectedChat)?.contact.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {chats.find((c) => c.id === selectedChat)?.contact.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {chats.find((c) => c.id === selectedChat)?.contact.status === 'online'
                            ? 'В сети'
                            : 'Не в сети'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="text-muted-foreground">
                          <Icon name="Phone" size={20} />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-muted-foreground">
                          <Icon name="Video" size={20} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              msg.sent
                                ? 'bg-muted text-muted-foreground'
                                : 'bg-primary text-primary-foreground'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <span className="text-xs opacity-70 mt-1 block">{msg.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="shrink-0">
                          <Icon name="Plus" size={20} />
                        </Button>
                        <Input
                          placeholder="Написать сообщение..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button size="icon" variant="ghost" className="shrink-0">
                          <Icon name="Mic" size={20} />
                        </Button>
                        <Button size="icon" onClick={handleSendMessage} className="shrink-0 bg-primary hover:bg-primary/90">
                          <Icon name="Send" size={20} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="contacts" className="mt-0 animate-fade-in">
              <div className="space-y-0">
                {contacts.map((contact) => (
                  <div key={contact.id} className="p-4 hover:bg-muted/50 transition-colors border-b bg-card">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
                            {contact.initials}
                          </AvatarFallback>
                        </Avatar>
                        {contact.status === 'online' && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {contact.status === 'online' ? 'В сети' : 'Не в сети'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline">
                          <Icon name="MessageCircle" size={20} />
                        </Button>
                        <Button size="icon" variant="outline">
                          <Icon name="Phone" size={20} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-0 animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1 p-1">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={item.url}
                        alt={`Gallery ${item.id}`}
                        className="w-full h-full object-cover"
                      />
                      {item.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Icon name="Play" size={32} className="text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {item.date}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="profile" className="mt-0 animate-fade-in">
              <div className="p-6 bg-card mx-4 my-4 rounded-lg">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-medium">
                      {currentUser.initials}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-semibold mb-1">{currentUser.name}</h2>
                  <p className="text-muted-foreground">{currentUser.email}</p>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="User" size={20} className="mr-2" />
                    Редактировать профиль
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="Bell" size={20} className="mr-2" />
                    Уведомления
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="Shield" size={20} className="mr-2" />
                    Приватность
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="HelpCircle" size={20} className="mr-2" />
                    Помощь
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-0 animate-fade-in">
              <div className="space-y-0 mx-4 my-4">
                <div className="p-4 bg-card border-b rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon name="Bell" size={20} className="text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">Уведомления</h3>
                        <p className="text-sm text-muted-foreground">Звук и вибрация</p>
                      </div>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon name="Moon" size={20} className="text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">Тёмная тема</h3>
                        <p className="text-sm text-muted-foreground">Выключено</p>
                      </div>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon name="Database" size={20} className="text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">Хранилище</h3>
                        <p className="text-sm text-muted-foreground">Управление данными</p>
                      </div>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon name="Lock" size={20} className="text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">Безопасность</h3>
                        <p className="text-sm text-muted-foreground">Пароль и защита</p>
                      </div>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon name="Info" size={20} className="text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">О приложении</h3>
                        <p className="text-sm text-muted-foreground">Версия 1.0.0</p>
                      </div>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </div>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;