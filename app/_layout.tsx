import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isMounted, setIsMounted] = useState(false);

  // 1. Avisa o app que o layout terminou de carregar na tela
  useEffect(() => {
    setIsMounted(true);
  }, []);

 // 2. Só faz o redirecionamento quando o layout estiver 100% pronto
  useEffect(() => {
    if (!isMounted) return;

    const currentSegment = segments[0];

    // Constantes criadas para o TypeScript aceitar de boa
    const estaNasTabs = segments.some(segment => segment === '(tabs)');
    const estaNoLogin = currentSegment === 'login';

    // CORREÇÃO DO IF AQUI:
    // Se não estiver na tela de login E NÃO estiver em nenhuma tela dentro das tabs, aí sim joga pro login
    if (!estaNoLogin && !estaNasTabs) {
      router.replace('/login');
    }
  }, [segments, isMounted]);

  return <Slot />;
}