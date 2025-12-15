/**
 * =====================================================
 * IMPORTAÇÕES
 * =====================================================
 * - React: base para criação de componentes
 * - Componentes visuais do React Native
 * - Ionicons: biblioteca de ícones do Expo
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * =====================================================
 * INTERFACE: LocationInfoProps
 * =====================================================
 * Define o contrato do componente:
 * - title: título exibido no card
 * - iconName: nome do ícone Ionicons
 * - children: conteúdo dinâmico passado ao componente
 */
interface LocationInfoProps {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}

/**
 * =====================================================
 * COMPONENTE: LocationInfo
 * =====================================================
 * Card reutilizável para exibição de informações
 * relacionadas à localização (coordenadas, endereço,
 * métricas, etc.)
 */
export default function LocationInfo({
  title,
  iconName,
  children,
}: LocationInfoProps) {
  return (
    /**
     * -----------------------------------------------
     * CONTAINER PRINCIPAL DO CARD
     * -----------------------------------------------
     */
    <View style={styles.card}>

      {/* =============================================
          CABEÇALHO DO CARD (ÍCONE + TÍTULO)
         ============================================= */}
      <View style={styles.header}>
        <Ionicons name={iconName} size={20} color="#E85D04" />
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* =============================================
          CONTEÚDO DINÂMICO DO CARD
         ============================================= */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

/**
 * =====================================================
 * ESTILOS
 * =====================================================
 * Centraliza toda a definição visual do componente
 */
const styles = StyleSheet.create({
  /**
   * -----------------------------------------------
   * CARD PRINCIPAL
   * -----------------------------------------------
   */
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,

    // Sombra no Android
    elevation: 2,

    // Sombra no iOS
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  /**
   * -----------------------------------------------
   * CABEÇALHO (ÍCONE + TEXTO)
   * -----------------------------------------------
   */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  /**
   * -----------------------------------------------
   * TÍTULO DO CARD
   * -----------------------------------------------
   */
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },

  /**
   * -----------------------------------------------
   * CONTEÚDO INTERNO
   * -----------------------------------------------
   * Recebe qualquer elemento via children
   */
  content: {},
});
