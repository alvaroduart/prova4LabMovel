/**
 * =====================================================
 * IMPORTAÇÕES
 * =====================================================
 * - React: base para criação de componentes
 * - createBottomTabNavigator: navegação por abas inferiores
 * - Ionicons: biblioteca de ícones
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

/**
 * =====================================================
 * IMPORTAÇÃO DAS TELAS
 * =====================================================
 * - MainScreen: tela principal (informações de geolocalização)
 * - MapScreen: tela do mapa interativo
 */
import MapScreen from '../screens/MapScreen';
import MainScreen from '../screens/MainScreen';

/**
 * =====================================================
 * CRIAÇÃO DO NAVEGADOR DE ABAS
 * =====================================================
 * Instância do Bottom Tab Navigator
 */
const Tab = createBottomTabNavigator();

/**
 * =====================================================
 * COMPONENTE: TABNAVIGATION
 * =====================================================
 * Responsável por:
 * - Gerenciar a navegação entre telas via abas
 * - Definir estilos globais da tab bar
 * - Definir ícones e rótulos das abas
 */
export default function TabNavigation() {
  return (
    <Tab.Navigator
      /**
       * =================================================
       * CONFIGURAÇÕES GERAIS DAS ABAS
       * =================================================
       * screenOptions permite customizar aparência e
       * comportamento das abas
       */
      screenOptions={({ route }) => ({
        // Remove o header padrão do React Navigation
        // (as telas já possuem seus próprios cabeçalhos)
        headerShown: false,

        // Estilo da barra inferior
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
        },

        // Cor do ícone/texto quando a aba está ativa
        tabBarActiveTintColor: '#4F46E5',

        // Cor do ícone/texto quando a aba está inativa
        tabBarInactiveTintColor: '#999',
      })}
    >
      {/* ==============================================
          ABA 1 – TELA PRINCIPAL
         ============================================== */}
      <Tab.Screen
        name="Main"
        component={MainScreen}
        options={{
          tabBarLabel: 'Início',

          // Ícone da aba "Início"
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="image" size={size} color={color} />
          ),
        }}
      />

      {/* ==============================================
          ABA 2 – MAPA
         ============================================== */}
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Mapa',

          // Ícone da aba "Mapa"
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
