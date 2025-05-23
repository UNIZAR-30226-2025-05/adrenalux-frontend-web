import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

export default function RotatingModel({ scene, children, ...props }) {
  const groupRef = useRef();
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.016;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      <primitive object={clonedScene} />
      {children}
    </group>
  );
}
