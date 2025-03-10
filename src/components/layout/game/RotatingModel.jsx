import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

export default function RotatingModel({ scene, ...props }) {
  const groupRef = useRef();

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.006;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      <primitive object={clonedScene} />
    </group>
  );
}
