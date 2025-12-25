
"use client";
import React, { forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import { Canvas, useFrame, type RootState } from "@react-three/fiber"
import { PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame, wrap } from "framer-motion";

// ============================================================================
// SHADER UTILITIES
// ============================================================================

const noise = `
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
           (c - a)* u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x,Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x,Pf1.y,Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy,Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy,Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x,Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz = mix(n_z.xy,n_z.zw,fade_xyz.y);
  float n_xyz = mix(n_yz.x,n_yz.y,fade_xyz.x);
  return 2.2 * n_xyz;
}
`

interface ExtendMaterialConfig {
  header: string
  vertexHeader?: string
  fragmentHeader?: string
  material?: THREE.MeshPhysicalMaterialParameters & { fog?: boolean }
  uniforms?: Record<string, any>
  vertex?: Record<string, string>
  fragment?: Record<string, string>
}

function extendMaterial(
  BaseMaterial: typeof THREE.MeshStandardMaterial,
  cfg: ExtendMaterialConfig
): THREE.ShaderMaterial {
  const physical = THREE.ShaderLib.physical as THREE.ShaderLibShader & {
    defines?: Record<string, any>
  }
  const { vertexShader: baseVert, fragmentShader: baseFrag, uniforms: baseUniforms } = physical
  const baseDefines = physical.defines ?? {}

  const uniforms: Record<string, THREE.IUniform> = THREE.UniformsUtils.clone(baseUniforms)

  const defaults = new BaseMaterial(cfg.material || {}) as any

  if (defaults.color) uniforms.diffuse.value = defaults.color
  if ("roughness" in defaults) uniforms.roughness.value = defaults.roughness
  if ("metalness" in defaults) uniforms.metalness.value = defaults.metalness
  if ("envMap" in defaults) uniforms.envMap.value = defaults.envMap
  if ("envMapIntensity" in defaults) uniforms.envMapIntensity.value = defaults.envMapIntensity

  Object.entries(cfg.uniforms ?? {}).forEach(([key, u]) => {
    uniforms[key] =
      u !== null && typeof u === "object" && "value" in u
        ? (u as THREE.IUniform)
        : ({ value: u } as THREE.IUniform)
  })

  let vert = `${cfg.header}
${cfg.vertexHeader ?? ""}
${baseVert}`
  let frag = `${cfg.header}
${cfg.fragmentHeader ?? ""}
${baseFrag}`

  for (const [inc, code] of Object.entries(cfg.vertex ?? {})) {
    vert = vert.replace(inc, `${inc}
${code}`)
  }

  for (const [inc, code] of Object.entries(cfg.fragment ?? {})) {
    frag = frag.replace(inc, `${inc}
${code}`)
  }

  const mat = new THREE.ShaderMaterial({
    defines: { ...baseDefines },
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    lights: true,
    fog: !!cfg.material?.fog,
  })

  return mat
}

const hexToNormalizedRGB = (hex: string): [number, number, number] => {
  const clean = hex.replace("#", "")
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  return [r / 255, g / 255, b / 255]
}

function createStackedPlanesBufferGeometry(
  n: number,
  width: number,
  height: number,
  spacing: number,
  heightSegments: number
): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry()
  const numVertices = n * (heightSegments + 1) * 2
  const numFaces = n * heightSegments * 2

  const positions = new Float32Array(numVertices * 3)
  const indices = new Uint32Array(numFaces * 3)
  const uvs = new Float32Array(numVertices * 2)

  let vertexOffset = 0
  let indexOffset = 0
  let uvOffset = 0

  const totalWidth = n * width + (n - 1) * spacing
  const xOffsetBase = -totalWidth / 2

  for (let i = 0; i < n; i++) {
    const xOffset = xOffsetBase + i * (width + spacing)
    const uvXOffset = Math.random() * 300
    const uvYOffset = Math.random() * 300

    for (let j = 0; j <= heightSegments; j++) {
      const y = height * (j / heightSegments - 0.5)
      const v0 = [xOffset, y, 0]
      const v1 = [xOffset + width, y, 0]

      positions.set([...v0, ...v1], vertexOffset * 3)

      const uvY = j / heightSegments
      uvs.set([uvXOffset, uvY + uvYOffset, uvXOffset + 1, uvY + uvYOffset], uvOffset)

      if (j < heightSegments) {
        const a = vertexOffset,
          b = vertexOffset + 1,
          c = vertexOffset + 2,
          d = vertexOffset + 3
        indices.set([a, b, c, c, b, d], indexOffset)
        indexOffset += 6
      }

      vertexOffset += 2
      uvOffset += 4
    }
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2))
  geometry.setIndex(new THREE.BufferAttribute(indices, 1))
  geometry.computeVertexNormals()

  return geometry
}

// ============================================================================
// BEAMS COMPONENTS
// ============================================================================

interface MergedPlanesProps {
  material: THREE.ShaderMaterial
  width: number
  count: number
  height: number
}

const MergedPlanes = forwardRef<THREE.Mesh, MergedPlanesProps>(
  ({ material, width, count, height }, ref) => {
    const mesh = useRef<THREE.Mesh>(null!)

    useImperativeHandle(ref, () => mesh.current)

    const geometry = useMemo(
      () => createStackedPlanesBufferGeometry(count, width, height, 0, 100),
      [count, width, height]
    )

    useFrame((_: RootState, delta: number) => {
      if (mesh.current && mesh.current.material) {
        const mat = mesh.current.material as THREE.ShaderMaterial
        if (mat.uniforms && mat.uniforms.time) {
          mat.uniforms.time.value += 0.1 * delta
        }
      }
    })

    return <mesh ref={mesh} geometry={geometry} material={material} />
  }
)

MergedPlanes.displayName = "MergedPlanes"

interface DirLightProps {
  position: [number, number, number]
  color: string
}

const DirLight: React.FC<DirLightProps> = ({ position, color }) => {
  const dir = useRef<THREE.DirectionalLight>(null!)

  return <directionalLight ref={dir} color={color} intensity={1} position={position} />
}

interface BeamsProps {
  beamWidth?: number
  beamHeight?: number
  beamNumber?: number
  lightColor?: string
  speed?: number
  noiseIntensity?: number
  scale?: number
  rotation?: number
}

const Beams: React.FC<BeamsProps> = ({
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 12,
  lightColor = "#ffffff",
  speed = 2,
  noiseIntensity = 1.75,
  scale = 0.2,
  rotation = 0,
}) => {
  const meshRef = useRef<THREE.Mesh>(null!)

  const beamMaterial = useMemo(
    () =>
      extendMaterial(THREE.MeshStandardMaterial, {
        header: `
  varying vec3 vEye;
  varying float vNoise;
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float time;
  uniform float uSpeed;
  uniform float uNoiseIntensity;
  uniform float uScale;
  ${noise}`,
        vertexHeader: `
  float getPos(vec3 pos) {
    vec3 noisePos =
      vec3(pos.x * 0., pos.y - uv.y, pos.z + time * uSpeed * 3.) * uScale;
    return cnoise(noisePos);
  }

  vec3 getCurrentPos(vec3 pos) {
    vec3 newpos = pos;
    newpos.z += getPos(pos);
    return newpos;
  }

  vec3 getNormal(vec3 pos) {
    vec3 curpos = getCurrentPos(pos);
    vec3 nextposX = getCurrentPos(pos + vec3(0.01, 0.0, 0.0));
    vec3 nextposZ = getCurrentPos(pos + vec3(0.0, -0.01, 0.0));
    vec3 tangentX = normalize(nextposX - curpos);
    vec3 tangentZ = normalize(nextposZ - curpos);
    return normalize(cross(tangentZ, tangentX));
  }`,
        fragmentHeader: "",
        vertex: {
          "#include <begin_vertex>": `transformed.z += getPos(transformed.xyz);`,
          "#include <beginnormal_vertex>": `objectNormal = getNormal(position.xyz);`,
        },
        fragment: {
          "#include <dithering_fragment>": `
    float randomNoise = noise(gl_FragCoord.xy);
    gl_FragColor.rgb -= randomNoise / 15. * uNoiseIntensity;`,
        },
        material: { fog: true },
        uniforms: {
          diffuse: new THREE.Color(...hexToNormalizedRGB("#000000")),
          time: { value: 0 },
          roughness: 0.3,
          metalness: 0.3,
          uSpeed: { value: speed },
          envMapIntensity: 10,
          uNoiseIntensity: noiseIntensity,
          uScale: scale,
        },
      }),
    [speed, noiseIntensity, scale]
  )

  return (
    <Canvas dpr={[1, 2]} frameloop="always" className="w-full h-full">
      <group rotation={[0, 0, (rotation * Math.PI) / 180]}>
        <MergedPlanes ref={meshRef} material={beamMaterial} count={beamNumber} width={beamWidth} height={beamHeight} />
        <DirLight color={lightColor} position={[0, 3, 10]} />
      </group>
      <ambientLight intensity={1} />
      <color attach="background" args={["#000000"]} />
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={30} />
    </Canvas>
  )
}

// ============================================================================
// SCROLL VELOCITY COMPONENT
// ============================================================================

interface ScrollVelocityProps {
  children: React.ReactNode[];
  velocity: number;
  movable?: boolean;
  clamp?: boolean;
}

const ScrollVelocity: React.FC<ScrollVelocityProps> = ({ 
  children, 
  velocity = 5, 
  movable = true, 
  clamp = false 
}) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 100,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 10000], [0, 5], {
    clamp,
  });

  const x = useTransform(baseX, (v) => `${wrap(0, -50, v)}%`);

  const directionFactor = React.useRef<number>(1);
  const scrollThreshold = React.useRef<number>(5);

  useAnimationFrame((t, delta) => {
    if (movable) {
      move(delta);
    } else {
      if (Math.abs(scrollVelocity.get()) >= scrollThreshold.current) {
        move(delta);
      }
    }
  });

  function move(delta: number) {
    let moveBy = directionFactor.current * velocity * (delta / 1000);
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  }

  return (
    <div className="relative m-0 flex flex-nowrap overflow-hidden whitespace-nowrap leading-[0.8] tracking-[-2px]">
      <motion.div
        className="flex flex-row flex-nowrap whitespace-nowrap *:mr-6 *:block"
        style={{ x }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// ============================================================================
// DEMO WEBSITES DATA
// ============================================================================

const demoWebsites = [
  {
    title: "Modern Restaurant",
    thumbnail: "/demo1.png",
    category: "Restaurant"
  },
  {
    title: "Tech Startup",
    thumbnail: "/demo2.png",
    category: "Technology"
  },
  {
    title: "Fitness Studio",
    thumbnail: "/demo3.png",
    category: "Fitness"
  },
  {
    title: "Real Estate Agency",
    thumbnail: "/demo4.png",
    category: "Real Estate"
  },
  {
    title: "Coffee Shop",
    thumbnail: "/demo5.png",
    category: "Cafe"
  }
];

const allWebsites = [...demoWebsites, ...demoWebsites];

// ============================================================================
// DEMO WEBSITES SECTION
// ============================================================================

function DemoWebsitesSection() {
  return (
    <div className="relative w-full bg-black py-20 overflow-hidden">
      {/* Beams Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Beams
          beamWidth={2.5}
          beamHeight={18}
          beamNumber={15}
          lightColor="#ffffff"
          speed={1.5}
          noiseIntensity={2}
          scale={0.15}
          rotation={-45}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Section Header */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8 mb-16 text-center">
          <Badge variant="secondary" className="mb-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 hover:bg-white/20">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Sample Websites Built on Our Platform
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Real Websites,
            {" "}
            <span className="bg-gradient-to-r from-white via-gray-100 to-white/80 bg-clip-text text-transparent">
              Real Results
            </span>
          </h2>
          
          <p className="text-lg text-white/70 max-w-2xl mx-auto font-light">
            See how businesses across different industries trust us to build their online presence
          </p>
        </div>

        {/* Scrolling Websites - Row 1 */}
        <div className="mb-8">
          <ScrollVelocity velocity={3} movable={true}>
            {allWebsites.map((website, idx) => (
              <div
                key={`row1-${idx}`}
                className="relative h-[200px] w-[320px] md:h-[240px] md:w-[380px] xl:h-[280px] xl:w-[440px] rounded-xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 z-10" />
                
                <img
                  src={website.thumbnail}
                  alt={website.title}
                  className="h-full w-full object-cover transition-transform duration-500"
                />
              </div>
            ))}
          </ScrollVelocity>
        </div>

        {/* Scrolling Websites - Row 2 (opposite direction) */}
        <div>
          <ScrollVelocity velocity={-3} movable={true}>
            {allWebsites.map((website, idx) => (
              <div
                key={`row2-${idx}`}
                className="relative h-[200px] w-[320px] md:h-[240px] md:w-[380px] xl:h-[280px] xl:w-[440px] rounded-xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 z-10" />
                
                <img
                  src={website.thumbnail}
                  alt={website.title}
                  className="h-full w-full object-cover transition-transform duration-500"
                />
              </div>
            ))}
          </ScrollVelocity>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-6 lg:px-8 mt-30 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
            Start Your Website Today —{" "}
            <span className="bg-gradient-to-r from-white via-gray-100 to-white/80 bg-clip-text text-transparent">
              Pay Nothing Upfront
            </span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="shadow-2xl shadow-white/25 min-w-[200px] bg-white text-black hover:bg-gray-100 group">
              Create Account
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="min-w-[200px] border-2 border-white/30 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:text-white hover:border-white/40">
              Request a Website
            </Button>
          </div>
        </div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
    </div>
  );
}

export default DemoWebsitesSection;