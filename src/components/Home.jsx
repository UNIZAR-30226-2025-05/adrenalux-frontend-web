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
            <div className="h-screen w-full backdrop-blur-sm">
                <NavBarGame />
                
                <div className="h-[calc(100vh-80px)] grid grid-cols-3 grid-rows-[1fr_auto] gap-8 p-8">
                    {/* Left Side - Menu Items */}
                    <div className="flex flex-col items-start justify-center gap-6 pl-12">
                        <ClassificationButton 
                            className="glass-container hover:!bg-indigo-600/50 transition-all"
                            iconClassName="text-indigo-400 h-8 w-8"
                        />
                        <TournamentButton 
                            className="glass-container hover:!bg-purple-600/50 transition-all"
                            iconClassName="text-purple-400 h-8 w-8"
                        />
                    </div>

                    {/* Center Area - Cards Menu */}
                    <div className="flex flex-col items-center justify-center">
                        <CardsMenu className="transform hover:scale-105 transition-transform duration-300" />
                    </div>

                    {/* Right Side - Menu Items */}
                    <div className="flex flex-col items-end justify-center gap-6 pr-12">
                        <StoreButton 
                            className="glass-container hover:!bg-emerald-600/50 transition-all"
                            iconClassName="text-emerald-400 h-8 w-8"
                        />
                        <CollectionButton 
                            className="glass-container hover:!bg-amber-600/50 transition-all"
                            iconClassName="text-amber-400 h-8 w-8"
                        />
                    </div>

                    {/* Play Button - Bottom Center */}
                    <div className="col-span-3 flex justify-center pb-8">
                        <PlayButton 
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 
                            px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                            iconClassName="h-10 w-10"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;