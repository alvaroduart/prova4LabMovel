/**
 * =====================================================
 * IMPORTAÇÕES
 * =====================================================
 * - useState, useEffect: hooks fundamentais do React
 * - expo-location: API do Expo para acesso à geolocalização
 */
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

/**
 * =====================================================
 * HOOK PERSONALIZADO: useLocation
 * =====================================================
 * Responsável por:
 * - Solicitar permissão de localização ao usuário
 * - Obter a posição geográfica atual (latitude/longitude)
 * - Realizar geocodificação reversa (converter coordenadas em endereço)
 * - Tratar erros de permissão
 */
export const useLocation = () => {

  /**
   * =================================================
   * ESTADOS DO HOOK
   * =================================================
   */

  // Armazena o objeto completo de localização (GPS)
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  // Armazena o endereço aproximado (rua, cidade, estado, etc.)
  const [address, setAddress] =
    useState<Location.LocationGeocodedAddress | null>(null);

  // Armazena mensagens de erro (ex: permissão negada)
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /**
   * =================================================
   * EFEITO DE INICIALIZAÇÃO
   * =================================================
   * Executado apenas uma vez ao montar o componente
   */
  useEffect(() => {
    (async () => {
      /**
       * ---------------------------------------------
       * 1. SOLICITA PERMISSÃO DE LOCALIZAÇÃO
       * ---------------------------------------------
       */
      let { status } = await Location.requestForegroundPermissionsAsync();

      // Caso o usuário negue a permissão
      if (status !== 'granted') {
        setErrorMsg('Permissão de acesso à localização negada');
        return;
      }

      /**
       * ---------------------------------------------
       * 2. OBTÉM A LOCALIZAÇÃO ATUAL
       * ---------------------------------------------
       */
      let currentLocation = await Location.getCurrentPositionAsync({});

      // Atualiza o estado com a posição atual
      setLocation(currentLocation);

      /**
       * ---------------------------------------------
       * 3. GEOCODIFICAÇÃO REVERSA
       * ---------------------------------------------
       * Converte latitude e longitude em endereço
       */
      let addressResponse = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      // Salva o primeiro endereço encontrado
      if (addressResponse.length > 0) {
        setAddress(addressResponse[0]);
      }
    })();
  }, []);

  /**
   * =================================================
   * RETORNO DO HOOK
   * =================================================
   * Disponibiliza os dados para qualquer componente
   */
  return { location, address, errorMsg };
};
