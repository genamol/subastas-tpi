import { useEffect, useRef } from 'react';

type SseHandlers = Record<string, (data: unknown) => void>;

export function useSse(
  obtenerTicket: () => Promise<string>,
  rutaStream: string,
  handlers: SseHandlers
) {
  const handlersRef = useRef<SseHandlers>(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    let es: EventSource | null = null;

    async function conectar() {
      const ticket = await obtenerTicket();
      const url = `http://localhost:8080${rutaStream}?ticket=${ticket}`;
      es = new EventSource(url);

      Object.keys(handlersRef.current).forEach((evento) => {
        es!.addEventListener(evento, (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data);
            handlersRef.current[evento]?.(data);
          } catch {
            handlersRef.current[evento]?.(e.data);
          }
        });
      });

      es.onerror = () => {
        es?.close();
      };
    }

    conectar();

    return () => {
      es?.close();
    };
  }, []);
}
