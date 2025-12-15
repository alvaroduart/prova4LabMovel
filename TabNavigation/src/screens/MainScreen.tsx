/**
 * ============================
 * IMPORTAÇÕES
 * ============================
 */
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../hooks/useLocation';

/**
 * ============================
 * COMPONENTES AUXILIARES
 * ============================
 */

// Card reutilizável para agrupar informações
interface InfoCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  children: React.ReactNode;
}

const InfoCard = ({ title, icon, color, children }: InfoCardProps) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <View style={styles.cardContent}>{children}</View>
  </View>
);

// Linha de métrica (label + valor)
interface MetricRowProps {
  label: string;
  value: string;
}

const MetricRow = ({ label, value }: MetricRowProps) => (
  <View style={styles.metricRow}>
    <Text style={styles.metricLabel}>{label}:</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

/**
 * ============================
 * TELA PRINCIPAL
 * ============================
 */
export default function MainScreen() {
  const { location, address, errorMsg } = useLocation();
  const navigation = useNavigation<any>();

  /**
   * Horário da última atualização do GPS
   * (memoizado para evitar reprocessamento)
   */
  const lastUpdated = useMemo(() => {
    if (!location?.timestamp) return null;

    const date = new Date(location.timestamp);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [location?.timestamp]);

  /**
   * ============================
   * LOADING (GPS ainda não obtido)
   * ============================
   */
  if (!location && !errorMsg) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Obtendo GPS...</Text>
      </View>
    );
  }

  /**
   * ============================
   * RENDERIZAÇÃO PRINCIPAL
   * ============================
   */
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* ============================
          CABEÇALHO COM DRAWER
         ============================ */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={32} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Explorando a Geo-Localização
        </Text>

        {/* Espaço visual para manter o título centralizado */}
        <View style={{ width: 32 }} />
      </View>

      {/* ============================
          BOTÃO PARA MAPA
         ============================ */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => navigation.navigate('Map')}
      >
        <Ionicons name="map" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Abrir Mapa Interativo</Text>
      </TouchableOpacity>

      {/* ============================
          CARD: COORDENADAS
         ============================ */}
      <InfoCard title="Coordenadas" icon="location" color="#E11D48">
        <MetricRow
          label="Latitude"
          value={`${location?.coords.latitude.toFixed(6)}°`}
        />
        <View style={styles.divider} />
        <MetricRow
          label="Longitude"
          value={`${location?.coords.longitude.toFixed(6)}°`}
        />
      </InfoCard>

      {/* ============================
          CARD: MÉTRICAS
         ============================ */}
      <InfoCard title="Métricas" icon="stats-chart" color="#10B981">
        <MetricRow
          label="Altitude"
          value={
            location?.coords.altitude
              ? `${location.coords.altitude.toFixed(1)} m`
              : 'N/A'
          }
        />
        <View style={styles.divider} />

        <MetricRow
          label="Accuracy"
          value={`±${location?.coords.accuracy?.toFixed(1)} m`}
        />
        <View style={styles.divider} />

        <MetricRow
          label="Speed"
          value={
            location?.coords.speed
              ? `${(location.coords.speed * 3.6).toFixed(1)} km/h`
              : '0 km/h'
          }
        />
        <View style={styles.divider} />

        <MetricRow
          label="Heading"
          value={
            location?.coords.heading
              ? `${location.coords.heading.toFixed(0)}°`
              : 'N/A'
          }
        />
      </InfoCard>

      {/* ============================
          CARD: ENDEREÇO
         ============================ */}
      <InfoCard title="Endereço (Aproximado)" icon="home" color="#D97706">
        {address ? (
          <View>
            <Text style={styles.addressText}>
              {address.street}, {address.streetNumber}
            </Text>
            <Text style={styles.addressText}>{address.district}</Text>
            <Text style={styles.addressText}>
              {address.region} - {address.postalCode}
            </Text>
            <Text style={styles.addressText}>{address.country}</Text>
          </View>
        ) : (
          <Text style={styles.addressText}>
            Endereço não encontrado
          </Text>
        )}
      </InfoCard>

      {/* ============================
          RODAPÉ
         ============================ */}
      {lastUpdated && (
        <Text style={styles.updatedFooter}>
          Atualizado: {lastUpdated}
        </Text>
      )}
    </ScrollView>
  );
}

/**
 * ============================
 * ESTILOS
 * ============================
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  menuButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },

  mainButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  cardContent: {
    gap: 8,
  },

  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  metricLabel: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 15,
    color: '#4F46E5',
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },

  addressText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },

  updatedFooter: {
    marginTop: 8,
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
