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
                
                {/* Diseño para pantallas medianas y grandes - Layout original */}
                <div className="hidden md:grid h-[calc(100vh-80px)] grid-cols-3 grid-rows-[1fr_auto] gap-4 md:gap-8 p-4 md:p-8">
                    {/* Left Side - Menu Items */}
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

                    {/* Right Side - Menu Items */}
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

                    {/* Play Button - Bottom Center con mayor espacio superior */}
                    <div className="col-span-3 flex justify-center pb-4 md:pb-8 mt-6 md:mt-10">
                        <PlayButton 
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 
                            px-8 md:px-12 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl hover:shadow-2xl transition-all"
                            iconClassName="h-8 md:h-10 w-8 md:w-10"
                        />
                    </div>
                </div>

                {/* Diseño para pantallas pequeñas - Layout vertical */}
                <div className="md:hidden flex flex-col h-[calc(100vh-80px)] p-4">
                    {/* Espacio adicional entre Navbar y Cards Menu */}
                    <div className="h-40"></div>
                    
                    {/* Cards Menu área con altura fija/máxima y escalado para cartagis más grandes */}
                    <div className="w-full flex-shrink-0 max-h-[45vh] flex items-center justify-center">
                        <CardsMenu className="transform scale-125 hover:scale-130 transition-transform duration-300" />
                    </div>
                    
                    {/* Espacio flexible entre elementos - Ahora más grande */}
                    <div className="flex-grow"></div>
                    
                    {/* Botones laterales en medio */}
                    <div className="flex justify-center w-full gap-4 mb-8">
                        <div className="flex gap-2">
                            <ClassificationButton 
                                className="glass-container hover:!bg-indigo-600/50 transition-all"
                                iconClassName="text-indigo-400 h-6 w-6"
                            />
                            <TournamentButton 
                                className="glass-container hover:!bg-purple-600/50 transition-all"
                                iconClassName="text-purple-400 h-6 w-6"
                            />
                        </div>
                        <div className="flex gap-2">
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

                    {/* Play Button en la parte inferior con más espacio */}
                    <div className="w-full flex-shrink-0 flex justify-center pb-6">
                        <PlayButton 
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 
                            px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                            iconClassName="h-8 w-8"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;