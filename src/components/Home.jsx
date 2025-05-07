import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const token = getToken();

    useEffect(() => {
        const initializeSocket = async () => {
            if (!socketService.socket) {
                const token = getToken();
                const profile = await getProfile();
                socketService.initialize(token, profile.data.username, navigate);
            }
        };

        if (!token) {
            navigate("/");
        }

        initializeSocket();
    }, [navigate, token]);

    return (
        <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
            <div className="h-screen w-full backdrop-blur-sm overflow-y-auto">
                <NavBarGame />
                
                {/* Diseño para pantallas medianas y grandes - Layout centrado */}
                <div className="hidden md:flex flex-col h-[calc(100vh-80px)] p-4 md:p-8 relative">
                    {/* Área superior con botones y cartas */}
                    <div className="grid grid-cols-3 mb-12">
                        {/* Left Side - Menu Items en columna (dos filas) */}
                        <div className="flex flex-col items-start justify-center gap-4 md:gap-6 pl-4 md:pl-12">
                            <ClassificationButton 
                                className="glass-container hover:!bg-indigo-600/50 transition-all"
                                iconClassName="text-indigo-400 h-6 md:h-8 w-6 md:w-8"
                            />
                            <TournamentButton 
                                className="glass-container hover:!bg-purple-600/50 transition-all"
                                iconClassName="text-purple-400 h-6 md:h-8 w-6 md:w-8"
                            />
                        </div>

                        {/* Center Area - Cards Menu */}
                        <div className="flex flex-col items-center justify-center">
                            <CardsMenu className="transform hover:scale-105 transition-transform duration-300" />
                        </div>

                        {/* Right Side - Menu Items en columna (dos filas) */}
                        <div className="flex flex-col items-end justify-center gap-4 md:gap-6 pr-4 md:pr-12">
                            <StoreButton 
                                className="glass-container hover:!bg-emerald-600/50 transition-all"
                                iconClassName="text-emerald-400 h-6 md:h-8 w-6 md:w-8"
                            />
                            <CollectionButton 
                                className="glass-container hover:!bg-amber-600/50 transition-all"
                                iconClassName="text-amber-400 h-6 md:h-8 w-6 md:w-8"
                            />
                        </div>
                    </div>

                    {/* Play Button - Centered pero más arriba */}
                    <div className="flex-grow flex justify-center items-start pt-16">
                        <PlayButton />
                    </div>
                </div>

                {/* Diseño para pantallas pequeñas - Vertical con Play Button debajo */}
                <div className="md:hidden flex flex-col items-center h-[calc(100vh-80px)] p-4">
                    {/* Cards Menu en la parte superior */}
                    <div className="w-full mb-6">
                        <CardsMenu className="transform hover:scale-105 transition-transform duration-300" />
                    </div>
                    
                    {/* Botones laterales en una sola fila */}
                    <div className="w-full mb-6">
                        <div className="flex justify-center gap-3">
                            <ClassificationButton 
                                className="glass-container hover:!bg-indigo-600/50 transition-all"
                                iconClassName="text-indigo-400 h-6 w-6"
                            />
                            <TournamentButton 
                                className="glass-container hover:!bg-purple-600/50 transition-all"
                                iconClassName="text-purple-400 h-6 w-6"
                            />
                            <StoreButton 
                                className="glass-container hover:!bg-emerald-600/50 transition-all"
                                iconClassName="text-emerald-400 h-6 w-6"
                            />
                            <CollectionButton 
                                className="glass-container hover:!bg-amber-600/50 transition-all"
                                iconClassName="text-amber-400 h-6 w-6"
                            />
                        </div>
                    </div>

                    {/* Play Button subido más arriba (ya no usa mt-auto) */}
                    <div className="w-full flex justify-center">
                        <PlayButton />
                    </div>
                    
                    {/* Espacio adicional en la parte inferior */}
                    <div className="flex-grow"></div>
                </div>
            </div>
        </div>
    );
};

export default Home;