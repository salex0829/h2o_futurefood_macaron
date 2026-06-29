"use client";

import "@/lib/patchThree";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import MacaronModel from "./MacaronModel";
import { MacaronId } from "@/types/survey";

type MacaronCanvasProps = {
  macaronId?: MacaronId;
  disabled?: boolean;
  debug?: boolean;
};

export default function MacaronCanvas({
  macaronId,
  disabled = false,
  debug = false,
}: MacaronCanvasProps) {
  return (
    <div className="relative h-[260px] min-h-[260px] w-full overflow-hidden rounded-[28px] bg-[#F2EDE4]">
      <Canvas
        frameloop="always"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.6, 4], fov: 35 }}
        gl={{ antialias: true, alpha: false }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 0, 0);
          gl.setClearColor("#F2EDE4");
          console.log("[MacaronCanvas] created");
        }}
      >
        <color attach="background" args={["#F2EDE4"]} />

        <ambientLight intensity={1.4} />
        <directionalLight position={[3, 4, 5]} intensity={2.0} />
        <pointLight position={[-3, 2, 3]} intensity={0.8} />

        {debug && (
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshBasicMaterial color="red" />
          </mesh>
        )}

        <MacaronModel macaronId={macaronId} disabled={disabled} />

        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.35}
          scale={4}
          blur={2.2}
          far={2}
        />
      </Canvas>
    </div>
  );
}
