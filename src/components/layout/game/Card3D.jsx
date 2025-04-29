import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import Model3D from "./Model3D";

export default function Card3D({ card, onClick = () => {} }) {
  console.log("Card3D render:", card);

  return (
    <div
      onClick={() => onClick(card)}
      className="cursor-pointer"
      style={{ width: "11rem", height: "18rem" }}
    >
      <Canvas style={{ width: "100%", height: "100%" }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Model3D
          card={card}
          scenePath="/models/card_3d.glb"
          scale={[2.5, 2.5, 0.5]}
        />
      </Canvas>
    </div>
  );
}
