import { Stars } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export function ChatFloatingDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="
                        fixed z-50
                        bottom-4 right-6
                        h-12 w-12
                        rounded-full
                        shadow-lg
                        hover:shadow-xl
                    "
        >
          <Stars className="w-5 h-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[380px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Chat</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto p-4">
            <p className="text-sm text-muted-foreground">
              Inicie uma conversa…
            </p>
          </div>

          <div className="border-t p-3 flex gap-2">
            <input
              className="flex-1 border rounded-md px-3 py-2 text-sm"
              placeholder="Digite uma mensagem"
            />
            <Button>Enviar</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
