import React from "react";
import { useGLTF, useTexture, Text } from "@react-three/drei";
import RotatingModel from "./RotatingModel";

export default function Model3D({ card, scenePath, scale }) {
  const { scene } = useGLTF(scenePath);
  const faceTexture = card?.face ? useTexture(card.face) : null;

  return (
    <RotatingModel scene={scene} scale={scale}>
      <Text position={[1, 0, 25]} fontSize={0.5} color="black" renderOrder={1}>
        ¡Prueba!
      </Text>
      {faceTexture && (
        <mesh position={[0, 0, 2]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={faceTexture} transparent />
        </mesh>
      )}
    </RotatingModel>
  );
}
