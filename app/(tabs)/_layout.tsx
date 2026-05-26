import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#388E3C', // Verde escuro para o item selecionado
        tabBarInactiveTintColor: '#9E9E9E', // Cinza para o item não selecionado
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 10,
        },
      }}>
      
      {/* 1. Aba da Jornada (Sua Home com os Cards) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jornada',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'leaf' : 'leaf-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* 2. Aba do Perfil (Onde aparece o progresso e medalhas) */}
      <Tabs.Screen
        name="perfil" 
        options={{
          title: 'Meu Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/*O PULO DO GATO: Mapeando a subpasta detalhes de forma oculta */}
      <Tabs.Screen
        name="detalhes/[id]" // Nome correspondente ao caminho interno da pasta
        options={{
          href: null, // 🔥 Isso impede TOTALMENTE de criar a quarta aba embaixo!
        }}
      />
      <Tabs.Screen
  name="explore"
  options={{
    href: null,
  }}
/>
    </Tabs>
  );
}