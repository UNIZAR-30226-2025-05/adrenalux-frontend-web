import ClassificationButton from "./ClassificationButton";
import TournamentButton from "./TournamentButton";
import StoreButton from "./StoreButton";
import CollectionButton from "./CollectionButton";

export default function GameActions() {
  return (
    <div className="relative h-screen w-full flex items-center px-64">
      {/* Left Side */}
      <div className="absolute left-20 top-1/2 transform -translate-y-1/2 flex flex-col space-y-48">
        <ClassificationButton />
        <TournamentButton />
      </div>

      {/* Right Side */}
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 flex flex-col space-y-48">
        <StoreButton />
        <CollectionButton />
      </div>
    </div>
  );
}