/**
 * =====================================================
 * IMPORTAÇÕES
 * =====================================================
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
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline, Polygon, Circle } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

/**
 * =====================================================
 * COMPONENTE PRINCIPAL – MAPSCREEN
 * =====================================================
 */
export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation<any>();

  const [origin, setOrigin] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Destino fixo (exemplo)
  const destination = {
    latitude: -21.5494,
    longitude: -45.4191,
  };

  /**
   * =====================================================
   * OBTENÇÃO DA LOCALIZAÇÃO ATUAL
   * =====================================================
   */
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão de localização negada');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
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
   */
  const areaCoords = [
    { latitude: destination.latitude + 0.0025, longitude: destination.longitude },
    { latitude: destination.latitude + 0.0005, longitude: destination.longitude + 0.0025 },
    { latitude: destination.latitude - 0.002, longitude: destination.longitude + 0.0015 },
    { latitude: destination.latitude - 0.002, longitude: destination.longitude - 0.0015 },
    { latitude: destination.latitude + 0.0005, longitude: destination.longitude - 0.0025 },
  ];

  /**
   * =====================================================
   * FUNÇÕES DE FOCO DO MAPA
   * =====================================================
   */
  const focusOnOrigin = () => {
    if (!origin) return;

    mapRef.current?.animateToRegion(
      {
        ...origin,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      },
      1000
    );
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
   * LOADING
   * =====================================================
   */
  if (!origin) {
    return (
      <View style={[styles.container, styles.loading]}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Localizando você...</Text>
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
          CABEÇALHO COM MENU
         ========================= */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={30} color="#333" />
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Rota Dinâmica</Text>
          <Text style={styles.subTitle}>Sua localização → Destino</Text>
        </View>
      </View>

      {/* =========================
          MAPA
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
        toolbarEnabled={false}
      >
        {/* Raio de precisão */}
        <Circle
          center={origin}
          radius={100}
          fillColor="rgba(79, 70, 229, 0.2)"
          strokeColor="transparent"
        />

        {/* Marcador da localização atual */}
        <Marker coordinate={origin} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles.myLocationMarker}>
            <View style={styles.myLocationDot} />
          </View>
        </Marker>

        {/* Destino */}
        <Marker coordinate={destination} title="Destino" pinColor="red" />

        {/* Rota */}
        <Polyline
          coordinates={[origin, destination]}
          strokeColor="#4F46E5"
          strokeWidth={4}
        />

        {/* Área de chegada */}
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
          LEGENDA
         ========================= */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: '#4F46E5' }]} />
          <Text style={styles.legendText}> Rota até o destino</Text>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.colorBox,
              { backgroundColor: 'rgba(34, 197, 94, 0.5)' },
            ]}
          />
          <Text style={styles.legendText}> Área de chegada</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#666',
  },

  header: {
    paddingTop: StatusBar.currentHeight
      ? StatusBar.currentHeight + 20
      : 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuButton: {
    marginRight: 15,
    padding: 5,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  subTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },

  map: {
    flex: 1,
    width: Dimensions.get('window').width,
  },

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

  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },

  legendText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
});
