import React, { useState, useEffect } from 'react';
import { NearbySearchResponse, searchNearbyBarberShops } from '../api/api';
import { Search, MapPin, Clock, Navigation } from 'lucide-react';
import L, { LatLngTuple, Map, Marker as LeafletMarker } from 'leaflet';
import { Marker } from 'react-leaflet'
import NewScheduleFormExternal from './NewScheduleFormExternal';
import { ToastContainer } from 'react-toastify';
import imageHero from '../assets/images/hero.png'

declare global {
  interface Window {
    L: typeof L;
  }
}

interface BarberShop {
  id: number;
  name: string;
  address: string;
  startWork: string | null;
  endWork: string | null;
  distance: number;
  distanceText: string;
  latitude: number;
  longitude: number;
}

interface UserLocation {
  lat: number;
  lon: number;
}

interface SearchResults {
  shops: BarberShop[];
  userLocation: UserLocation;
}

type Marker = LeafletMarker & {
  remove: () => void;
};

const BarberSearchComponentOpenGoogleMaps: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [map, setMap] = useState<Map | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  // const [position, setPosition] = useState<LatLngExpression>([0, 0, 0]);
 const [selectedBarber, setSelectedBarber] = useState(0)
  // Estilo CSS para a scrollbar customizada
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #1f2937;
      border-radius: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #4b5563;
      border-radius: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #6b7280;
    }
  `;

  useEffect(() => {
    // Adiciona os estilos do scrollbar
    const styleElement = document.createElement('style');
    styleElement.textContent = scrollbarStyles;
    document.head.appendChild(styleElement);

    // Carrega o CSS do Leaflet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
    document.head.appendChild(link);

    // Carrega o script do Leaflet
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(styleElement);
      document.head.removeChild(link);
      document.head.removeChild(script);
      if (map) {
        map.remove();
      }
    };
  }, []);

  const initializeMap = (): void => {
    if (!window.L || document.getElementById('map')?.hasChildNodes()) return;

    const initialPosition: LatLngTuple = [-23.5505, -46.6333];
    const newMap = window.L.map('map').setView(initialPosition, 13);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(newMap);

    setMap(newMap);
  };

  const updateMapMarkers = (shops: BarberShop[], userLocation: UserLocation): void => {
    if (!map || !window.L) return;

    // Limpa marcadores existentes
    markers.forEach(marker => marker.remove());
    setMarkers([]);

    const newMarkers: Marker[] = [];

    // Marcador do usuário
    const userPosition: LatLngTuple = [userLocation.lat, userLocation.lon];
    const userMarker = window.L.marker(
      userPosition,
      {
        icon: window.L.divIcon({
          className: 'user-marker',
          html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>`,
          iconSize: [16, 16]
        })
      }
    ).addTo(map) as Marker;

    newMarkers.push(userMarker);

    // Marcadores das barbearias
    shops.forEach(shop => {
      const shopPosition: LatLngTuple = [shop.latitude, shop.longitude];
      const marker = window.L.marker(
        shopPosition,
        {
          icon: window.L.divIcon({
            className: 'shop-marker',
            html: `<div class="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white"></div>`,
            iconSize: [16, 16]
          })
        }
      )
        .bindPopup(`
        <strong>${shop.name}</strong><br>
        ${shop.address}<br>
        Distância: ${shop.distanceText}
      `)
        .addTo(map) as Marker;

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Ajusta o zoom para mostrar todos os pontos
    const points: LatLngTuple[] = [
      userPosition,
      ...shops.map(shop => [shop.latitude, shop.longitude] as LatLngTuple)
    ];

    const bounds = window.L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [50, 50] });
  };

  const handleSearch = async (): Promise<void> => {
    if (!address.trim()) {
      setError('Por favor, digite um endereço');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response: NearbySearchResponse | any = await searchNearbyBarberShops(address);
      if ('error' in response) {
        throw new Error(response.error);
      }


      setSearchResults(response.data);
      if (response.data.userLocation && response.data.shops) {
        updateMapMarkers(response.data.shops, response.data.userLocation);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar barbearias');
    } finally {
      setLoading(false);
    }
  };

  // function setCoordinatesToMap(data: LatLngExpression) {
  //   console.log(data);
  //   setPosition(data)
  // }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAddress(e.target.value);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !loading) {
      handleSearch();
    }
  };


  useEffect(()=>{
    if(!address){
      setSearchResults(null)
    }
  },[address])
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6">
      <ToastContainer />
      {/* Search Box */}
      <div className="mb-8">
        
        {!searchResults && (
          <>
            <h1 className="text-4xl font-bold mb-4">Encontre Barbearias Próximas</h1>
            <p className="text-gray-300 mb-6">Digite seu endereço e encontre as melhores barbearias da sua região</p>
          </>
        )
      }
      <img src={imageHero} alt="Visual Financeiro" className="w-full max-w-md rounded-lg" />
      {searchResults && (
          <div className="bg-red-500 flex-col justify-center items-center">
            <h1 className="text-4xl font-bold mb-4">Veja Mais</h1>
            <p className="text-gray-300 mb-6">Algumas alternativas encontradas</p>
          </div>
        )
      }
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Digite seu endereço completo"
            value={address}
            onChange={handleAddressChange}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-yellow-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-red-400 text-sm">{error}</p>
        )}
      </div>

      {/* Results Section */}
      {searchResults && searchResults.shops.length > 0 ? (
        <div className="flex w-full">
          {/* Lista de Barbearias */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            {searchResults.shops.map((shop) => (
              <div
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-yellow-500 transition-colors md:w-3/12 w-full"
                key={shop.id}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-white">{shop.name}</h3>
                    <span className="text-yellow-500 font-medium text-sm">
                      {shop.distanceText}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-300">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {shop.address}
                    </p>

                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {shop.startWork} - {shop.endWork}
                    </p>
                  </div>

                  <div className="flex  gap-2 pt-2">
                    <label
                      htmlFor="new-schedule"
                      className="flex-1 px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer "
                      onClick={() => setSelectedBarber(shop.id)}
                    >
                      Agendar
                    </label>

                    <input className="modal-state" id="new-schedule" type="checkbox" />
                    <div className="modal w-full">
                      <label className="modal-overlay" htmlFor="new-schedule"></label>
                      <div className="modal-content flex flex-col gap-5 w-full">
                        <label htmlFor="new-schedule" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                        <h2 className="text-xl">Novo agendamento</h2>
                        <NewScheduleFormExternal barberShopId={selectedBarber} loadingData={()=>console.log("new-schedule")} />

                      </div>
                    </div>

                    <button
                      className="flex-1 px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                      // onClick={() => setCoordinatesToMap([shop.latitude, shop.longitude])}
                      onClick={() => window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`,
                        '_blank'
                      )}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Maps
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map */}
          {/* <div className="h-96 bg-gray-800 rounded-lg overflow-hidden">
            <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
              <Marker position={position}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          </div> */}
        </div>
      ) : searchResults ? (
        <div className="text-center text-gray-300 py-8">
          Nenhuma barbearia encontrada próxima ao endereço informado.
        </div>
      ) : null}
    </div>
  );
};

export default BarberSearchComponentOpenGoogleMaps;