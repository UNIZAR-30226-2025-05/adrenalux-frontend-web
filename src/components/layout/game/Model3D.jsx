import React from "react";
import { useGLTF, useTexture, Text } from "@react-three/drei";
import RotatingModel from "./RotatingModel";
import { DoubleSide } from "three";

export default function Model3D({ card, scenePath, scale }) {
  const { scene } = useGLTF(scenePath);
  const playerTexture = card?.photo ? useTexture(card.photo) : null;

  return (
    <RotatingModel scene={scene} scale={scale}>
      {playerTexture && (
        <mesh position={[0, 0.4, 0.15]}>
          {" "}
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={playerTexture}
            transparent
            side={DoubleSide}
          />
        </mesh>
      )}

      <Text
        position={[0, -0.6, 0.2]}
        fontSize={0.1}
        color="white"
        renderOrder={1}
      >
        {card.alias}
      </Text>
    </RotatingModel>
  );
}
