/**
 * =====================================================
 * IMPORTAÇÕES
 * =====================================================
 * - React e hooks para controle de estado, ciclo de vida
 * - Componentes visuais do React Native
 * - MapView e elementos gráficos do mapa
 * - Ícones (Ionicons)
 * - Expo Location para acesso ao GPS do dispositivo
 */
import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  StatusBar, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import MapView, { Marker, Polyline, Polygon, Circle } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

/**
 * =====================================================
 * COMPONENTE PRINCIPAL – MAPSCREEN
 * =====================================================
 * Tela responsável por:
 * - Obter a localização real do usuário
 * - Exibir mapa interativo
 * - Desenhar rota, área de chegada e marcadores
 */
export default function MapScreen() {

  /**
   * =====================================================
   * REFERÊNCIA DO MAPA
   * =====================================================
   * Permite controlar o mapa programaticamente
   * (zoom, foco, animações de câmera)
   */
  const mapRef = useRef<MapView>(null);

  /**
   * =====================================================
   * ESTADO: ORIGEM DINÂMICA (LOCALIZAÇÃO ATUAL)
   * =====================================================
   * Inicia como null e recebe latitude/longitude reais
   */
  const [origin, setOrigin] = useState<null | {
    latitude: number;
    longitude: number;
  }>(null);

  /**
   * =====================================================
   * DESTINO FIXO
   * =====================================================
   * Coordenadas predefinidas do ponto final
   */
  const destination = { latitude: -21.5494, longitude: -45.4191 };

  /**
   * =====================================================
   * EFEITO: OBTÉM LOCALIZAÇÃO REAL DO USUÁRIO
   * =====================================================
   * - Solicita permissão
   * - Obtém posição atual
   * - Atualiza a origem dinâmica
   */
  useEffect(() => {
    (async () => {
      // Solicita permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão de localização negada');
        return;
      }

      // Obtém a posição atual do GPS
      const location = await Location.getCurrentPositionAsync({});

      // Atualiza o estado com a posição real
      setOrigin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  /**
   * =====================================================
   * ÁREA DE CHEGADA (POLÍGONO)
   * =====================================================
   * Define um pentágono ao redor do destino
   */
  const areaCoords = [
    { latitude: destination.latitude + 0.0025, longitude: destination.longitude },
    { latitude: destination.latitude + 0.0005, longitude: destination.longitude + 0.0025 },
    { latitude: destination.latitude - 0.0020, longitude: destination.longitude + 0.0015 },
    { latitude: destination.latitude - 0.0020, longitude: destination.longitude - 0.0015 },
    { latitude: destination.latitude + 0.0005, longitude: destination.longitude - 0.0025 },
  ];

  /**
   * =====================================================
   * FUNÇÕES DE FOCO DO MAPA
   * =====================================================
   * Centralizam o mapa na origem ou no destino
   */
  const focusOnOrigin = () => {
    if (origin) {
      mapRef.current?.animateToRegion(
        {
          ...origin,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        },
        1000
      );
    }
  };

  const focusOnDestination = () => {
    mapRef.current?.animateToRegion(
      {
        ...destination,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      },
      1000
    );
  };

  /**
   * =====================================================
   * TELA DE CARREGAMENTO
   * =====================================================
   * Exibida enquanto a localização não é obtida
   */
  if (!origin) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ marginTop: 10, color: '#666' }}>
          Localizando você...
        </Text>
      </View>
    );
  }

  /**
   * =====================================================
   * RENDERIZAÇÃO PRINCIPAL
   * =====================================================
   */
  return (
    <View style={styles.container}>

      {/* =========================
          CABEÇALHO DA TELA
         ========================= */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rota Dinâmica</Text>
        <Text style={styles.subTitle}>Sua localização → Destino</Text>
      </View>

      {/* =========================
          MAPA INTERATIVO
         ========================= */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        showsUserLocation={false}
        toolbarEnabled={false}
      >

        {/* Raio visual da posição atual */}
        <Circle
          center={origin}
          radius={100}
          fillColor="rgba(79, 70, 229, 0.2)"
          strokeColor="transparent"
        />

        {/* Marcador personalizado da posição atual */}
        <Marker coordinate={origin} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles.myLocationMarker}>
            <View style={styles.myLocationDot} />
          </View>
        </Marker>

        {/* Marcador do destino */}
        <Marker coordinate={destination} title="Destino" pinColor="red" />

        {/* Linha de rota entre origem e destino */}
        <Polyline
          coordinates={[origin, destination]}
          strokeColor="#4F46E5"
          strokeWidth={4}
        />

        {/* Área de chegada (polígono) */}
        <Polygon
          coordinates={areaCoords}
          fillColor="rgba(34, 197, 94, 0.2)"
          strokeColor="transparent"
        />
      </MapView>

      {/* =========================
          BOTÕES FLUTUANTES
         ========================= */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fabButton} onPress={focusOnOrigin}>
          <Ionicons name="location" size={24} color="#E11D48" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.fabButton} onPress={focusOnDestination}>
          <Ionicons name="flag" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* =========================
          LEGENDA DO MAPA
         ========================= */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: '#4F46E5' }]} />
          <Text style={styles.legendText}> Rota até o Destino</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: 'rgba(34, 197, 94, 0.5)' }]} />
          <Text style={styles.legendText}> Área de Chegada</Text>
        </View>
      </View>
    </View>
  );
}

/**
 * =====================================================
 * ESTILOS
 * =====================================================
 */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: { 
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 5
  },

  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  subTitle: { fontSize: 14, color: '#666', marginTop: 2 },

  map: { flex: 1, width: Dimensions.get('window').width },

  myLocationMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  myLocationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
  },

  fabContainer: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    gap: 12,
  },

  fabButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  legendContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 6,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  colorBox: { width: 16, height: 16, borderRadius: 4 },

  legendText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
});
