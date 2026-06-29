"use client";

import "@/lib/patchThree";
import { MutableRefObject, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import MacaronMesh from "./MacaronMesh";

type Props = {
  isAnswered: boolean;
  hoverRef: MutableRefObject<boolean>;
};

export default function MacaronScene({ isAnswered, hoverRef }: Props) {
  // Defer Canvas mount by one rAF so the browser has committed the parent
  // element's layout before WebGL reads its dimensions. Without this, the
  // canvas initialises with a 0×0 viewport on first render and never recovers.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) {
    // Placeholder that matches the canvas background so there is no flash.
    return <div className="w-full h-full" style={{ background: "#F8F3EA" }} />;
  }

  return (
    <Canvas
      // frameloop="always" prevents the render loop from pausing after the
      // first frame, which can happen in some browser / visibility states.
      frameloop="always"
      camera={{ position: [0, 0.22, 2.6], fov: 44 }}
      shadows="percentage"
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      // display:block removes the inline-element gap that can make the canvas
      // report a height of 0 inside flex / block containers.
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <color attach="background" args={["#F8F3EA"]} />

      <ambientLight intensity={0.85} />
      <directionalLight
        position={[3, 4, 5]}
        intensity={1.65}
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <pointLight position={[-3, 2, 3]} intensity={0.55} />
      <directionalLight
        position={[-1.5, -1, -4]}
        intensity={0.28}
        color="#f0e4cc"
      />

      <MacaronMesh isAnswered={isAnswered} hoverRef={hoverRef} />

      <ContactShadows
        position={[0, -0.55, 0]}
        opacity={0.28}
        scale={3.5}
        blur={2.6}
        far={2.5}
      />

      <Environment preset="studio" />
    </Canvas>
  );
}
