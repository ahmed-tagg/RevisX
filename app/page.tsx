"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Brain, Cpu, ExternalLink, FileText, Microscope, Sparkles } from "lucide-react"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, Cylinder } from "@react-three/drei"
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  // Create DNA helix structure
  const helixData = useMemo(() => {
    const points = []
    const connections = []
    const numPoints = 20
    const radius = 1.5
    const height = 6

    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 4
      const y = (i / numPoints) * height - height / 2

      // First strand
      const x1 = Math.cos(t) * radius
      const z1 = Math.sin(t) * radius
      points.push({ x: x1, y, z: z1, strand: 0 })

      // Second strand (opposite)
      const x2 = Math.cos(t + Math.PI) * radius
      const z2 = Math.sin(t + Math.PI) * radius
      points.push({ x: x2, y, z: z2, strand: 1 })

      // Base pairs (connections between strands)
      if (i < numPoints - 1) {
        connections.push([i * 2, i * 2 + 1])
      }
    }

    return { points, connections }
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      // Rotate the DNA helix
      groupRef.current.rotation.y += 0.01

      // Mouse interaction
      const mouse = state.mouse
      groupRef.current.rotation.x = mouse.y * 0.3
      groupRef.current.rotation.z = mouse.x * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* DNA backbone spheres */}
      {helixData.points.map((point, index) => (
        <Sphere key={index} position={[point.x, point.y, point.z]} args={[0.1, 8, 8]}>
          <meshStandardMaterial
            color={point.strand === 0 ? "#8b5cf6" : "#3b82f6"}
            emissive={point.strand === 0 ? "#8b5cf6" : "#3b82f6"}
            emissiveIntensity={0.2}
          />
        </Sphere>
      ))}

      {/* Base pair connections */}
      {helixData.connections.map((connection, index) => {
        const point1 = helixData.points[connection[0]]
        const point2 = helixData.points[connection[1]]
        const midpoint = {
          x: (point1.x + point2.x) / 2,
          y: (point1.y + point2.y) / 2,
          z: (point1.z + point2.z) / 2,
        }
        const distance = Math.sqrt(
          Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2) + Math.pow(point2.z - point1.z, 2),
        )

        return (
          <Cylinder
            key={index}
            position={[midpoint.x, midpoint.y, midpoint.z]}
            args={[0.02, 0.02, distance, 8]}
            rotation={[0, 0, Math.atan2(point2.z - point1.z, point2.x - point1.x)]}
          >
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.1} />
          </Cylinder>
        )
      })}
    </group>
  )
}

function CartoonComputer() {
  const computerGroup = useRef<THREE.Group>(null)

  // Animation for floating effect
  useFrame((state) => {
    if (computerGroup.current) {
      computerGroup.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
      computerGroup.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  // Fluffy material properties
  const fluffyMaterial = {
    roughness: 0.9,
    metalness: 0.1,
    emissiveIntensity: 0.2,
  }

  return (
    <group ref={computerGroup} scale={[1.8, 1.8, 1.8]} position={[0, 0, 0]}>
      {/* Monitor */}
      <group position={[0, 0.2, 0]}>
        {/* Monitor frame */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[1.8, 1.2, 0.1]} />
          <meshStandardMaterial color="#6366f1" {...fluffyMaterial} emissive="#6366f1" />
        </mesh>

        {/* Screen */}
        <mesh position={[0, 0.6, 0.06]}>
          <boxGeometry args={[1.6, 1, 0.05]} />
          <meshStandardMaterial color="#c7d2fe" emissive="#c7d2fe" emissiveIntensity={0.3} roughness={0.7} />
        </mesh>

        {/* Monitor stand */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.2, 0.5, 16]} />
          <meshStandardMaterial color="#6366f1" {...fluffyMaterial} emissive="#6366f1" />
        </mesh>

        {/* Monitor base */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
          <meshStandardMaterial color="#6366f1" {...fluffyMaterial} emissive="#6366f1" />
        </mesh>
      </group>

      {/* Keyboard */}
      <mesh position={[0, -0.3, 0.4]}>
        <boxGeometry args={[1.4, 0.1, 0.6]} />
        <meshStandardMaterial color="#4f46e5" {...fluffyMaterial} emissive="#4f46e5" />
      </mesh>

      {/* Keyboard keys (simplified) */}
      <group position={[0, -0.2, 0.4]}>
        {[-0.5, -0.25, 0, 0.25, 0.5].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            {[-0.15, 0, 0.15].map((z, j) => (
              <mesh key={j} position={[0, 0, z]}>
                <boxGeometry args={[0.12, 0.05, 0.12]} />
                <meshStandardMaterial color="#c7d2fe" roughness={0.8} metalness={0.1} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Mouse */}
      <mesh position={[0.8, -0.3, 0.4]}>
        <capsuleGeometry args={[0.1, 0.2, 8, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#4f46e5" {...fluffyMaterial} emissive="#4f46e5" />
      </mesh>

      {/* Fluffy cloud-like particles around the computer */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const radius = 1.5 + Math.random() * 0.5
        const yOffset = Math.random() * 1.2 - 0.6
        const scale = 0.1 + Math.random() * 0.15
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, 0.6 + yOffset, Math.sin(angle) * radius]}
            scale={[scale, scale, scale]}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#818cf8" : "#c084fc"}
              emissive={i % 2 === 0 ? "#818cf8" : "#c084fc"}
              emissiveIntensity={0.5}
              roughness={1}
              metalness={0}
              transparent={true}
              opacity={0.8}
            />
          </mesh>
        )
      })}

      {/* Additional fluffy details */}
      {[...Array(20)].map((_, i) => {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const radius = 2.2
        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.sin(phi) * Math.sin(theta)
        const z = radius * Math.cos(phi)
        const scale = 0.05 + Math.random() * 0.08

        return (
          <mesh key={`fluff-${i}`} position={[x, y, z]} scale={[scale, scale, scale]}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshStandardMaterial color="#e0e7ff" transparent={true} opacity={0.6} roughness={1} metalness={0} />
          </mesh>
        )
      })}
    </group>
  )
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <span className="text-xl font-bold tracking-tight">
              Revis<span className="text-purple-500">X</span>
            </span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link
              href="#biomedical"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Biomedical Science
            </Link>
            <Link
              href="#computer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Computer Science
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link
              href="#submit"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Submit
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden md:flex">
              Log in
            </Button>
            <Button size="sm" className="hidden md:flex">
              Subscribe
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="inline-flex bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 mb-2">
                    For the next generation of scientists
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Research Evolved Via Innovative Science
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Empowering young minds to explore, discover, and innovate at the intersection of biomedical and
                    computer science.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    Read Latest Issue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  import { Button } from "@/components/ui/button"
import Link from "next/link"

<Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
  <a
    href="http://reviz.infinityfreeapp.com/ojs"
    target="_blank"
    rel="noopener noreferrer"
  >
    Submit your research
  </a>
</Button>

                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] md:h-[450px] md:w-[450px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                  <Canvas className="relative z-10">
                    <ambientLight intensity={0.7} />
                    <pointLight position={[10, 10, 10]} intensity={1.2} />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#e0e7ff" />
                    <DNAHelix />
                    <OrbitControls enableZoom={false} enablePan={false} />
                  </Canvas>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm dark:bg-purple-900">
                  Featured Articles
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Cutting-Edge Research</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore the latest breakthroughs from emerging scientists across disciplines
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-video relative bg-purple-100 dark:bg-purple-900/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-2">Biomedical</Badge>
                  <h3 className="text-xl font-bold">Neural Interface Breakthroughs</h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground mt-2">
                    New advances in brain-computer interfaces allow for unprecedented control of prosthetic limbs.
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <Button variant="link" className="p-0 h-auto text-purple-600 dark:text-purple-400">
                      Read more <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-video relative bg-blue-100 dark:bg-blue-900/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    Computer Science
                  </Badge>
                  <h3 className="text-xl font-bold">Quantum Computing Applications</h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground mt-2">
                    How quantum algorithms are revolutionizing complex problem-solving in materials science.
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <Button variant="link" className="p-0 h-auto text-blue-600 dark:text-blue-400">
                      Read more <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-video relative bg-green-100 dark:bg-green-900/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Microscope className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Interdisciplinary
                  </Badge>
                  <h3 className="text-xl font-bold">AI in Drug Discovery</h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground mt-2">
                    Machine learning models accelerate identification of potential therapeutic compounds.
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <Button variant="link" className="p-0 h-auto text-green-600 dark:text-green-400">
                      Read more <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="divisions" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Divisions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore cutting-edge research across our specialized fields
                </p>
              </div>
            </div>
            <Tabs defaultValue="biomedical" className="mt-12">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="biomedical">Biomedical Science</TabsTrigger>
                <TabsTrigger value="computer">Computer Science</TabsTrigger>
              </TabsList>
              <TabsContent value="biomedical" id="biomedical" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100">
                        <Brain className="mr-1 h-4 w-4" />
                        Biomedical Science
                      </div>
                      <h3 className="text-2xl font-bold">Advancing Human Health</h3>
                      <p className="text-muted-foreground">
                        Our biomedical division focuses on groundbreaking research in genetics, neuroscience,
                        immunology, and more. We're particularly interested in research that bridges traditional
                        boundaries.
                      </p>
                    </div>
                    <ul className="grid gap-2">
                      <li className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-purple-600 dark:text-purple-400"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span>Genetic Engineering & CRISPR</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-purple-600 dark:text-purple-400"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span>Neuroscience & Brain Mapping</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-purple-600 dark:text-purple-400"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span>Immunology & Vaccine Development</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-purple-600 dark:text-purple-400"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span>Regenerative Medicine</span>
                      </li>
                    </ul>
                    <div>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        Explore Biomedical Research
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative h-[350px] w-full overflow-hidden rounded-xl">
                      <Canvas className="w-full h-full">
                        <ambientLight intensity={0.7} />
                        <pointLight position={[10, 10, 10]} intensity={1.2} />
                        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#e0e7ff" />
                        <CartoonComputer />
                        <OrbitControls enableZoom={false} enablePan={false} />
                      </Canvas>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="computer" id="computer" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100">
                        <Cpu className="mr-1 h-4 w-4" />
                        Computer Science
                      </div>
                      <h3 className="text-2xl font-bold">Pushing Computational Boundaries</h3>
                      <p className="text-muted-foreground">
                        Our computer science division explores cutting-edge technologies in artificial intelligence,
                        quantum computing, cybersecurity, and more, with a focus on real-world applications.
                      </p>
                    </div>
                    <ul className="grid gap-2">
                      <li className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span>Artificial Intelligence & Machine Learning</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span>Quantum Computing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span>Cybersecurity & Cryptography</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span>Human-Computer Interaction</span>
                      </li>
                    </ul>
                    <div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Explore Computer Science Research
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative h-[350px] w-full overflow-hidden rounded-xl">
                      <img
                        src="/placeholder.svg?height=350&width=500"
                        alt="Computer Science Research"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm dark:bg-purple-900">
                    About RevisX
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Mission</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    RevisX was founded with a vision to revolutionize scientific publishing for the next generation of
                    researchers. We believe in:
                  </p>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-purple-600 dark:text-purple-400"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span>Making science accessible to younger generations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-purple-600 dark:text-purple-400"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span>Fostering interdisciplinary collaboration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-purple-600 dark:text-purple-400"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span>Promoting creative approaches to scientific problems</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-purple-600 dark:text-purple-400"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span>Supporting early-career researchers</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-full overflow-hidden rounded-xl">
                  <img
                    src="/placeholder.svg?height=350&width=500"
                    alt="RevisX Team"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="submit"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50 dark:from-background dark:to-gray-900"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm dark:bg-purple-900">
                  Call for Papers
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Submit Your Research</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We're looking for innovative research from emerging scientists across disciplines
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                      <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold">Submission Guidelines</h3>
                  </div>
                  <ul className="grid gap-2">
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5"
                      >
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                      <span>Original research not published elsewhere</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5"
                      >
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                      <span>Maximum 5,000 words (excluding references)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5"
                      >
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                      <span>Clear methodology and reproducible results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5"
                      >
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                      <span>Visual elements encouraged (figures, diagrams)</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6">Download Full Guidelines</Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-blue-600 dark:text-blue-400"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <path d="M8.5 10.5h7" />
                        <path d="M8.5 14h7" />
                        <path d="M8.5 17.5h7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Submit Your Paper</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Ready to contribute to the scientific community? Our peer review process is rigorous but supportive,
                    especially for early-career researchers.
                  </p>
                  import { Button } from "@/components/ui/button"
import Link from "next/link"

<Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
  <a
    href="http://reviz.infinityfreeapp.com/ojs"
    target="_blank"
    rel="noopener noreferrer"
  >
    Submit Manuscript
  </a>
</Button>


                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <span className="text-lg font-bold">
              Revis<span className="text-purple-500">X</span>
            </span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2025 RevisX Journal. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
