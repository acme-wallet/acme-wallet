import { createFileRoute } from '@tanstack/react-router';
import { ChatContainer } from '@/components/chat/chat-container';

export const Route = createFileRoute('/_auth/chat/')({
  component: ChatPage,
});

function ChatPage() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Chat IA</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Converse com o modelo de linguagem com suporte a streaming e
          raciocínio.
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <ChatContainer />
      </div>
    </div>
  );
}
