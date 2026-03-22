import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  MapPin, 
  Layers, 
  Zap, 
  ArrowRight,
  Menu,
  X,
  Github,
  Twitter,
  Facebook,
  CheckCircle,
  Loader2
} from "lucide-react";
import React, { useState, useEffect, Suspense, useRef } from "react";
import emailjs from '@emailjs/browser';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Create a hollow square frame (diamond when rotated) - Memoized
const DiamondFrame = React.memo(({ position, color, rotationY = 0 }: { position: [number, number, number], color: string, rotationY?: number }) => {
  const size = 2;
  const thickness = 0.35;
  const depth = 0.35;
  
  // Create the frame using 4 boxes
  return (
    <group position={position} rotation={[0, rotationY, Math.PI / 4]}>
      {/* Top bar */}
      <mesh position={[0, size/2, 0]}>
        <boxGeometry args={[size + thickness, thickness, depth]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Bottom bar */}
      <mesh position={[0, -size/2, 0]}>
        <boxGeometry args={[size + thickness, thickness, depth]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Left bar */}
      <mesh position={[-size/2, 0, 0]}>
        <boxGeometry args={[thickness, size - thickness, depth]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Right bar */}
      <mesh position={[size/2, 0, 0]}>
        <boxGeometry args={[thickness, size - thickness, depth]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  );
});

// Custom floating animation using useFrame (avoids deprecated THREE.Clock)
const FloatingGroup = ({ children, speed = 1, floatIntensity = 0.8, rotationIntensity = 0.4 }: { 
  children: React.ReactNode, 
  speed?: number, 
  floatIntensity?: number, 
  rotationIntensity?: number 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta * speed;
    const t = timeRef.current;
    groupRef.current.position.y = Math.sin(t) * floatIntensity * 0.1;
    groupRef.current.rotation.x = Math.sin(t * 0.5) * rotationIntensity * 0.1;
    groupRef.current.rotation.z = Math.cos(t * 0.3) * rotationIntensity * 0.05;
  });
  
  return <group ref={groupRef}>{children}</group>;
};

const Scene3D = React.memo(() => {
  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[0, 5, 5]} intensity={0.8} />
      
      <FloatingGroup speed={1} rotationIntensity={0.4} floatIntensity={0.8}>
        <group scale={0.7} position={[0, 0, 0]}>
          {/* White diamond - left */}
          <DiamondFrame position={[-1.4, 0, 0.3]} color="#FFFFFF" rotationY={0} />
          {/* Gray diamond - center */}
          <DiamondFrame position={[0, 0, 0]} color="#666666" rotationY={0} />
          {/* Black diamond - right */}
          <DiamondFrame position={[1.4, 0, -0.3]} color="#1a1a1a" rotationY={0} />
        </group>
      </FloatingGroup>

      <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={0.05} />
    </>
  );
});

const InteractiveLogo = React.memo(() => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="flex justify-center lg:justify-end"
    >
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square bg-surface-container rounded-3xl overflow-hidden group cursor-grab active:cursor-grabbing">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none z-10"></div>
        
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white/20">Loading...</div>}>
          <Canvas 
            camera={{ position: [0, 0, 10], fov: 30 }} 
            dpr={[1, 1.5]}
            performance={{ min: 0.5 }}
          >
            <Scene3D />
          </Canvas>
        </Suspense>

        <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Touch to rotate vision</span>
        </div>
      </div>
    </motion.div>
  );
});

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Tech Stack", href: "#stack" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "glass-nav py-4" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
          <a href="#" className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" className="w-12 h-12" role="img" aria-label="Guesstures Logo">
              <defs>
                <path id="ring" fillRule="evenodd"
                  d="M 290 -410 H -290 A 120 120 0 0 0 -410 -290 V 290 A 120 120 0 0 0 -290 410 H 290 A 120 120 0 0 0 410 290 V -290 A 120 120 0 0 0 290 -410 Z
                     M 230 -270 H -230 A 40 40 0 0 0 -270 -230 V 230 A 40 40 0 0 0 -230 270 H 230 A 40 40 0 0 0 270 230 V -230 A 40 40 0 0 0 230 -270 Z"/>
              </defs>
              <g transform="translate(590 1000) rotate(45)">
                <use href="#ring" fill="#ffffff"/>
              </g>
              <g transform="translate(983 1000) rotate(45)">
                <use href="#ring" fill="#a1a1aa"/>
              </g>
              <g transform="translate(1347 1000) rotate(45)">
                <use href="#ring" fill="#52525b"/>
              </g>
            </svg>
            <span className="text-xl font-bold font-headline tracking-tight">GUESSTURES</span>
          </a>
          
          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="text-sm font-medium font-headline tracking-tight text-on-surface-variant hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden sm:block bg-primary text-background px-6 py-2 rounded-lg font-bold font-headline text-sm hover:bg-on-surface-variant transition-colors"
            >
              Get in Touch
            </button>
            
            {/* Mobile Toggle */}
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-background flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" className="w-12 h-12" role="img" aria-label="Guesstures Logo">
                  <defs>
                    <path id="ring-mobile" fillRule="evenodd"
                      d="M 290 -410 H -290 A 120 120 0 0 0 -410 -290 V 290 A 120 120 0 0 0 -290 410 H 290 A 120 120 0 0 0 410 290 V -290 A 120 120 0 0 0 290 -410 Z
                         M 230 -270 H -230 A 40 40 0 0 0 -270 -230 V 230 A 40 40 0 0 0 -230 270 H 230 A 40 40 0 0 0 270 230 V -230 A 40 40 0 0 0 230 -270 Z"/>
                  </defs>
                  <g transform="translate(590 1000) rotate(45)">
                    <use href="#ring-mobile" fill="#ffffff"/>
                  </g>
                  <g transform="translate(983 1000) rotate(45)">
                    <use href="#ring-mobile" fill="#a1a1aa"/>
                  </g>
                  <g transform="translate(1347 1000) rotate(45)">
                    <use href="#ring-mobile" fill="#52525b"/>
                  </g>
                </svg>
                <span className="text-xl font-bold font-headline tracking-tight">GUESSTURES</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl font-bold font-headline tracking-tighter hover:text-on-surface-variant transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-primary text-background px-8 py-4 rounded-xl font-bold font-headline text-xl mt-4"
              >
                Get in Touch
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-surface-container w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ghost-border"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-surface-container-highest rounded-full hover:bg-white hover:text-background transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Animated code lines for background effect - Optimized with CSS animations
const CodeBackground = React.memo(() => {
  const codeLines = [
    "const app = createServer({ port: 3000 });",
    "import { useState, useEffect } from 'react';",
    "async function fetchData(url: string) {",
    "  return response.json();",
    "export default function App() {",
    "  const [data, setData] = useState(null);",
    "router.get('/api/users', async (req, res) => {",
    "  res.json(users);",
    "const config = { theme: 'dark', lang: 'en' };",
    "class Component extends React.PureComponent {",
    "npm install @tailwindcss/typography",
    "git push origin main --force-with-lease",
  ];

  // Pre-compute doubled array once
  const doubledLines = [...codeLines, ...codeLines];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Left column - scrolling up (only column on mobile) */}
      <div className="absolute left-[5%] top-0 flex flex-col gap-4 text-[10px] md:text-xs font-mono text-white/[0.03] whitespace-nowrap code-scroll-up">
        {doubledLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      
      {/* Right column - scrolling down (hidden on mobile) */}
      <div className="absolute right-[5%] top-0 hidden md:flex flex-col gap-4 text-[10px] md:text-xs font-mono text-white/[0.03] whitespace-nowrap code-scroll-down">
        {doubledLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      
      {/* Center column - scrolling up slowly (hidden until lg) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 flex-col gap-4 text-[10px] md:text-xs font-mono text-white/[0.02] whitespace-nowrap hidden lg:flex code-scroll-slow">
        {doubledLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
});

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center pt-20 px-4 sm:px-6 md:px-8 overflow-hidden">
        {/* Animated code background */}
        <CodeBackground />
        
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-surface-container-highest to-transparent rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold font-headline tracking-tighter leading-[0.9]">
              We Build <br/><span className="text-on-surface-variant">What You Need.</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-lg leading-relaxed">
              From custom web applications to scalable mobile solutions, Guesstures delivers high-performance tech tailored to your vision.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary text-background px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold font-headline text-base sm:text-lg hover:bg-on-surface-variant transition-all active:scale-95"
              >
                Start Your Project
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="ghost-border text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold font-headline text-base sm:text-lg hover:bg-surface-container transition-all active:scale-95"
              >
                View Portfolio
              </button>
            </div>
          </motion.div>
          <InteractiveLogo />
        </div>
      </section>
<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <div className="p-4 sm:p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
    <div className="space-y-6">
      <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
        The Founding Trio
      </div>
      
      <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight uppercase">
        Guesturess
      </h2>
      
      <p className="text-on-surface-variant leading-relaxed text-lg">
        GUESTURESS is the result of three dedicated programmers coming together to solve complex digital challenges. Our foundation is built on a shared obsession with clean code and high-performance architecture.
      </p>

      {/* The 3 Diamonds Explanation */}
      <div className="pt-4 border-t border-surface-container-highest">
        <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">The Symbolism</h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <div className="w-2 h-2 rotate-45 bg-white border border-outline mx-auto mb-2"></div>
            <p className="text-[10px] font-bold uppercase">Pure Craft</p>
          </div>
          <div className="space-y-1">
            <div className="w-2 h-2 rotate-45 bg-gray-500 mx-auto mb-2"></div>
            <p className="text-[10px] font-bold uppercase">Scalable Logic</p>
          </div>
          <div className="space-y-1">
            <div className="w-2 h-2 rotate-45 bg-black mx-auto mb-2"></div>
            <p className="text-[10px] font-bold uppercase">Elegant Design</p>
          </div>
        </div>
        <p className="mt-4 text-sm italic text-on-surface-variant">
          "The three interlocking diamonds represent our individual expertise woven into a single, unbreakable vision."
        </p>
      </div>

      <div className="flex gap-4">
        <a href="https://github.com/guessturesdev-cell" className="p-3 bg-surface-container-highest rounded-xl hover:bg-primary hover:text-background transition-all"><Github className="w-5 h-5" /></a>
        <a href="https://www.facebook.com/profile.php?id=61588659292244" className="p-3 bg-surface-container-highest rounded-xl hover:bg-primary hover:text-background transition-all"><Facebook className="w-5 h-5" /></a>
        <a href="#" className="p-3 bg-surface-container-highest rounded-xl hover:bg-primary hover:text-background transition-all"><Twitter className="w-5 h-5" /></a>
      </div>
    </div>

    {/* Right Side: Logo Display */}
    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
      <img 
        src={`${import.meta.env.BASE_URL}guesstures.jpg`}
        alt="Guesturess Interlocking Diamonds Logo" 
        className="w-full h-auto drop-shadow-2xl"
      />
    </div>
  </div>
</Modal>
    </>
  );
};

const Philosophy = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-surface-container-low px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-outline-variant">Our Philosophy</h2>
          </div>
          <div className="lg:col-span-8">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-headline font-bold leading-tight"
            >
              We are a flexible, tech-driven partner helping clients worldwide navigate the complexity of modern digital infrastructure. We don't just write code; we architect solutions.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <Layers className="text-primary w-10 h-10" />
                <h3 className="text-xl font-bold font-headline">Scalable Architecture</h3>
                <p className="text-on-surface-variant leading-relaxed">Systems built to handle growth without compromising on speed or reliability.</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <Zap className="text-primary w-10 h-10" />
                <h3 className="text-xl font-bold font-headline">High Performance</h3>
                <p className="text-on-surface-variant leading-relaxed">Optimized performance metrics that ensure a seamless experience for your end users.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const projects = [
    {
      title: "E-Commers Platform",
      category: "Digital Commerce",
      image: `${import.meta.env.BASE_URL}dashboard.png`,
      span: "md:col-span-3"
    },
    {
      title: "Application Development",
      category: "Software Solutions",
      image: `${import.meta.env.BASE_URL}android.png`,
      span: "md:col-span-3"
    },
    {
      title: "Web/Applicaiton Development",
      category: "Full Stack",
      image: `${import.meta.env.BASE_URL}webapp.png`,
      span: "md:col-span-2"
    },
    {
      title: "Finest Unique Design UI/UX",
      category: "Creative Direction",
      image: `${import.meta.env.BASE_URL}uiux.jpg`,
      span: "md:col-span-2"
    },
    {
      title: "Game Development",
      category: "Immersive Media",
      image: `${import.meta.env.BASE_URL}gamedev.png`,
      span: "md:col-span-2"
    }
  ];

  return (
    <section id="projects" className="py-20 md:py-32 bg-surface px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-headline tracking-tight">Work Services</h2>
          <p className="text-on-surface-variant max-w-sm">A curation of our latest technical deployments and high-end digital products.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${project.span} bg-surface-container rounded-xl overflow-hidden group cursor-pointer`}
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60"></div>
              </div>
              <div className="p-8 space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-outline-variant">{project.category}</span>
                <h3 className="text-2xl font-bold font-headline">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TechStack = () => {
  const stack = [
    { name: "Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
    { name: "FastAPI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
    { name: "Laravel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Vue", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
    { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" }
  ];

  return (
    <section id="stack" className="py-20 md:py-32 bg-surface-container-low px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-headline tracking-tight">Development Stack</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">We leverage the most robust and modern technologies to ensure performance, security, and scalability in every line of code.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-outline-variant/20 rounded-xl border border-outline-variant/20 overflow-hidden">
          {stack.map((tech, index) => (
            <motion.div 
              key={index}
              whileHover={{ backgroundColor: "rgba(58, 57, 57, 0.5)" }}
              className="bg-surface p-8 flex flex-col items-center justify-center gap-4 transition-colors cursor-default group"
            >
              <div className="w-12 h-12 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                <img 
                  src={tech.icon} 
                  alt={tech.name} 
                  className="w-10 h-10 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-headline font-bold text-sm text-on-surface-variant group-hover:text-white transition-colors">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    setStatus('sending');

    try {
      // EmailJS configuration from environment variables
      const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'guesstures.dev@gmail.com'
        },
        PUBLIC_KEY
      );

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset to idle after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Email send failed:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-surface px-4 sm:px-6 md:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-headline tracking-tight">Let's build <br/>together.</h2>
            <p className="text-xl text-on-surface-variant max-w-md">Ready to start your next project? Drop us a line and our technical lead will get back to you within 24 hours.</p>
            <div className="space-y-6 pt-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-lg">
                  <Mail className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-outline-variant uppercase font-bold tracking-widest">Email Us</p>
                  <p className="text-lg font-bold">guesstures.dev@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-lg">
                  <MapPin className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-outline-variant uppercase font-bold tracking-widest">Headquarters</p>
                  <p className="text-lg font-bold">TUGUEGARAO CITY, PH</p>
                </div>
              </div>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-surface-container p-8 md:p-12 rounded-xl"
          >
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <h3 className="text-2xl font-bold font-headline">Message Sent!</h3>
                <p className="text-on-surface-variant">Thank you for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-outline-variant">Name</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-surface-container-highest/50 border-b border-outline-variant py-4 px-4 text-white placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors rounded-t-lg" 
                    placeholder="Your Name" 
                    type="text"
                    required
                    disabled={status === 'sending'}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-outline-variant">Email</label>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-surface-container-highest/50 border-b border-outline-variant py-4 px-4 text-white placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors rounded-t-lg" 
                    placeholder="email@example.com" 
                    type="email"
                    required
                    disabled={status === 'sending'}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-outline-variant">Project Details</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-surface-container-highest/50 border-b border-outline-variant py-4 px-4 text-white placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors resize-none rounded-t-lg" 
                    placeholder="Tell us about your project..." 
                    rows={4}
                    required
                    disabled={status === 'sending'}
                  ></textarea>
                </div>
                {status === 'error' && (
                  <p className="text-red-500 text-sm">Failed to send message. Please try again or email us directly.</p>
                )}
                <button 
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-primary text-background py-5 rounded-lg font-bold font-headline text-lg hover:bg-on-surface-variant transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest w-full py-8 md:py-12 px-4 sm:px-6 md:px-8 border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" className="w-8 h-8" role="img" aria-label="Guesstures Logo">
            <defs>
              <path id="ring-footer" fillRule="evenodd"
                d="M 290 -410 H -290 A 120 120 0 0 0 -410 -290 V 290 A 120 120 0 0 0 -290 410 H 290 A 120 120 0 0 0 410 290 V -290 A 120 120 0 0 0 290 -410 Z
                   M 230 -270 H -230 A 40 40 0 0 0 -270 -230 V 230 A 40 40 0 0 0 -230 270 H 230 A 40 40 0 0 0 270 230 V -230 A 40 40 0 0 0 230 -270 Z"/>
            </defs>
            <g transform="translate(590 1000) rotate(45)">
              <use href="#ring-footer" fill="#ffffff"/>
            </g>
            <g transform="translate(983 1000) rotate(45)">
              <use href="#ring-footer" fill="#a1a1aa"/>
            </g>
            <g transform="translate(1347 1000) rotate(45)">
              <use href="#ring-footer" fill="#52525b"/>
            </g>
          </svg>
          <span className="text-lg font-bold font-headline tracking-tight">GUESSTURES</span>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a className="text-on-surface-variant font-medium text-sm hover:text-white transition-colors" href="#">Privacy Policy</a>
          <a className="text-on-surface-variant font-medium text-sm hover:text-white transition-colors" href="#">Terms of Service</a>
          {/* <a className="text-on-surface-variant font-medium text-sm hover:text-white transition-colors" href="#">LinkedIn</a> */}
          <a className="text-on-surface-variant font-medium text-sm hover:text-white transition-colors" href="https://github.com/guessturesdev-cell">GitHub</a>
        </div>
          <div className="text-on-surface-variant text-sm text-center">
              © 2026 Guesstures Editorial. All rights reserved. <br /> 
              Designed by <a href="https://kupxzu.github.io/carlkupxzu-portfolio/" className="text-cyan-400 hover:text-cyan-300 transition-colors">KUPXZU</a>  Guesstures Team.
          </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen selection:bg-primary selection:text-background">
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <Projects />
        <TechStack />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
