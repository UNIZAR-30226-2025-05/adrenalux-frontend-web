import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { socketService } from '../services/websocket/socketService';
import { getToken } from '../services/api/authApi';
import { getProfile } from '../services/api/profileApi';
import NavBarGame from './layout/game/NavbarGame';
import background from '../assets/background.png';
import TournamentButton from './layout/game/TournamentButton';
import ClassificationButton from './layout/game/ClassificationButton';
import StoreButton from './layout/game/StoreButton';
import CollectionButton from './layout/game/CollectionButton';
import PlayButton from './layout/game/PlayButton';
import CardsMenu from './layout/game/CardsMenu';

const Home = () => {
    const navigate = useNavigate(); // Obtener la función navigate

    useEffect(() => {
        const initializeSocket = async () => {
            if (!socketService.socket) { // Solo inicializa si no hay socket
                const token = getToken();
                const profile = await getProfile();
                socketService.initialize(token, profile.data.username, navigate); // Pasar navigate aquí
            }
        };

        initializeSocket();
    }, [navigate]); // Añadir navigate como dependencia

    return (
      <div className="fixed inset-0 flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
        <NavBarGame />

        <div className="relative h-screen w-full flex items-center px-[20%]">
          {/* Left Side */}
          <div className="absolute left-[10%] top-[25%] flex flex-col space-y-10">
            <ClassificationButton />
            <TournamentButton />
          </div>

          {/* Cards Menu in the Center */}
          <div className="mx-auto">
            <CardsMenu />
          </div>

          {/* Right Side */}
          <div className="absolute right-[10%] top-[25%] flex flex-col space-y-10">
            <StoreButton />
            <CollectionButton />
          </div>

          {/* Play Button Centered at Bottom */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <PlayButton />
          </div>
        </div>
      </div>
    );
};

export default Home;
