import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatMessage, type Message } from './chat-message';
import { PromptInput } from './prompt-input';
import { SystemPromptConfig, type ModelOption } from './system-prompt-config';
import { useLazyStreamChatQuery } from '../../store/services/api';

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(
    'You are a helpful assistant.',
  );
  const [model, setModel] = useState<ModelOption>('o4-mini');

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const assistantIdRef = useRef<string | null>(null);

  const [triggerStream, { data: streamData }] = useLazyStreamChatQuery();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  useEffect(() => {
    const id = assistantIdRef.current;
    if (!id || !streamData) return;

    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              content: streamData.error
                ? `⚠️ Erro: ${streamData.error}`
                : streamData.content,
              reasoning: streamData.reasoning,
              isStreaming: !streamData.done,
            }
          : m,
      ),
    );

    if (streamData.done) {
      setIsStreaming(false);
      assistantIdRef.current = null;
    }
  }, [streamData]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };

    const assistantId = crypto.randomUUID();
    assistantIdRef.current = assistantId;

    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      reasoning: '',
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
    setIsStreaming(true);

    triggerStream({ message: trimmed, systemPrompt, model });
  }, [input, isStreaming, systemPrompt, model, triggerStream]);

  return (
    <div className="flex h-full flex-col gap-3">
      <SystemPromptConfig
        systemPrompt={systemPrompt}
        onSystemPromptChange={setSystemPrompt}
        model={model}
        onModelChange={setModel}
      />

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto rounded-xl border border-border bg-background"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-foreground">Iniciar conversa</p>
              <p className="text-sm text-muted-foreground mt-1">
                Envie uma mensagem para começar. O modelo irá responder em tempo
                real com suporte a raciocínio.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 p-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <PromptInput
        value={input}
        onChange={setInput}
        onSubmit={sendMessage}
        disabled={isStreaming}
      />
      <p className="text-xs text-center text-muted-foreground">
        Ctrl+Enter para enviar · Modelo: <strong>{model}</strong>
      </p>
    </div>
  );
}
