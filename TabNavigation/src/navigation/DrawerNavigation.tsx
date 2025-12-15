// ================================
// IMPORTAÇÕES
// ================================

// Importa o React para criação do componente funcional
import React from 'react';

// Importa o criador do Drawer Navigator (menu lateral)
import { createDrawerNavigator } from '@react-navigation/drawer';

// Importa os ícones do pacote Ionicons (usado no Expo)
import { Ionicons } from '@expo/vector-icons';

// Importa as telas que serão exibidas dentro do Drawer
import MainScreen from '../screens/MainScreen';
import MapScreen from '../screens/MapScreen';


// ================================
// CRIAÇÃO DO DRAWER NAVIGATOR
// ================================

// Instancia o Drawer Navigator
const Drawer = createDrawerNavigator();


// ================================
// COMPONENTE DE NAVEGAÇÃO PRINCIPAL
// ================================

export default function DrawerNavigation() {
  return (
    // Componente principal do Drawer
    <Drawer.Navigator
      screenOptions={{
        // Oculta o header padrão do React Navigation
        headerShown: false,

        // Cor do texto e ícone do item ativo
        drawerActiveTintColor: '#4F46E5',

        // Cor de fundo do item ativo
        drawerActiveBackgroundColor: '#EEF2FF',

        // Cor do texto e ícone dos itens inativos
        drawerInactiveTintColor: '#333',

        // Estilo geral do Drawer (menu lateral)
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },

        // Estilo do texto (label) dos itens do menu
        drawerLabelStyle: {
          // Espaçamento entre ícone e texto
          // (corrigido de -20 para 10)
          marginLeft: 10,
          fontSize: 15,
          fontWeight: '500',
        },
      }}
    >

      {/* ================================
          TELA PRINCIPAL (INÍCIO)
         ================================ */}
      <Drawer.Screen
        name="Main"
        component={MainScreen}
        options={{
          // Texto exibido no menu
          drawerLabel: 'Início',

          // Ícone exibido ao lado do texto
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* ================================
          TELA DO MAPA
         ================================ */}
      <Drawer.Screen
        name="Map"
        component={MapScreen}
        options={{
          // Texto exibido no menu
          drawerLabel: 'Mapa Interativo',

          // Ícone exibido ao lado do texto
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="map-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />

    </Drawer.Navigator>
  );
}
