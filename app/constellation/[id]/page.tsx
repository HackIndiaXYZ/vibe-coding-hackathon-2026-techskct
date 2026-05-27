'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useRef, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Zap, ZoomIn, ZoomOut, RotateCcw, Info, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Star {
  id: string;
  x: number;
  y: number;
  radius: number;
  label: string;
  category: string;
  brightness: number;
  connections: string[];
  pulse: number;
  color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  language:    '#818cf8',
  framework:   '#22d3ee',
  database:    '#34d399',
  cloud:       '#fbbf24',
  tool:        '#f472b6',
  soft:        '#a78bfa',
  default:     '#94a3b8',
};

const SKILL_CATEGORIES: Record<string, string> = {
  // Languages
  javascript: 'language', typescript: 'language', python: 'language',
  java: 'language', 'c++': 'language', rust: 'language', go: 'language',
  swift: 'language', kotlin: 'language', ruby: 'language', php: 'language',
  // Frameworks
  react: 'framework', vue: 'framework', angular: 'framework', nextjs: 'framework',
  nodejs: 'framework', express: 'framework', django: 'framework', flask: 'framework',
  spring: 'framework', rails: 'framework', laravel: 'framework',
  // Databases
  postgresql: 'database', mysql: 'database', mongodb: 'database',
  redis: 'database', supabase: 'database', firebase: 'database',
  // Cloud
  aws: 'cloud', azure: 'cloud', gcp: 'cloud', docker: 'cloud',
  kubernetes: 'cloud', terraform: 'cloud', vercel: 'cloud',
  // Tools
  git: 'tool', figma: 'tool', jira: 'tool', linux: 'tool',
  graphql: 'tool', 'ci/cd': 'tool', jest: 'tool',
  // Soft
  leadership: 'soft', communication: 'soft', agile: 'soft',
  scrum: 'soft', mentoring: 'soft', 'problem solving': 'soft',
};

function getCategory(skill: string): string {
  const lower = skill.toLowerCase();
  return SKILL_CATEGORIES[lower] || 'default';
}

function buildConstellation(skills: string[]): Star[] {
  const stars: Star[] = [];
  const centerX = 500;
  const centerY = 400;
  const rings = [120, 230, 340];

  const grouped: Record<string, string[]> = {};
  skills.forEach(s => {
    const cat = getCategory(s);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(s);
  });

  let starIdx = 0;
  Object.entries(grouped).forEach(([cat, catSkills], catIdx) => {
    catSkills.forEach((skill, skillIdx) => {
      const ring = Math.min(catIdx, rings.length - 1);
      const totalInRing = catSkills.length;
      const angleOffset = (catIdx * Math.PI * 0.4);
      const angle = angleOffset + (skillIdx / totalInRing) * Math.PI * 2;
      const r = rings[ring] + (skillIdx % 2) * 40;
      const jitter = (Math.random() - 0.5) * 30;

      stars.push({
        id: `star-${starIdx++}`,
        x: centerX + Math.cos(angle) * r + jitter,
        y: centerY + Math.sin(angle) * r + jitter,
        radius: 3 + Math.random() * 4,
        label: skill,
        category: cat,
        brightness: 0.5 + Math.random() * 0.5,
        connections: [],
        pulse: Math.random() * Math.PI * 2,
        color: CATEGORY_COLORS[cat] || CATEGORY_COLORS.default,
      });
    });
  });

  // Connect nearby same-category stars
  stars.forEach(s => {
    stars
      .filter(t => t.id !== s.id && t.category === s.category)
      .sort((a, b) => {
        const da = Math.hypot(a.x - s.x, a.y - s.y);
        const db = Math.hypot(b.x - s.x, b.y - s.y);
        return da - db;
      })
      .slice(0, 2)
      .forEach(t => {
        if (!s.connections.includes(t.id)) s.connections.push(t.id);
      });
  });

  return stars;
}

export default function ConstellationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [hoveredStar, setHoveredStar] = useState<Star | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('portfolios').select('*').eq('id', id).single();
      if (data) {
        setPortfolio(data);
        starsRef.current = buildConstellation(data.data?.skills || DEMO_SKILLS);
      } else {
        starsRef.current = buildConstellation(DEMO_SKILLS);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      t += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      const tx = canvas.width / 2 + offset.x;
      const ty = canvas.height / 2 + offset.y;
      ctx.translate(tx, ty);
      ctx.scale(zoom, zoom);
      ctx.translate(-500, -400);

      const stars = starsRef.current;

      // Draw nebula backgrounds per category group
      const groups: Record<string, Star[]> = {};
      stars.forEach(s => {
        if (!groups[s.category]) groups[s.category] = [];
        groups[s.category].push(s);
      });

      Object.entries(groups).forEach(([cat, group]) => {
        if (group.length < 2) return;
        const cx = group.reduce((a, s) => a + s.x, 0) / group.length;
        const cy = group.reduce((a, s) => a + s.y, 0) / group.length;
        const maxR = Math.max(...group.map(s => Math.hypot(s.x - cx, s.y - cy))) + 40;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
        const col = CATEGORY_COLORS[cat] || '#6366f1';
        grad.addColorStop(0, col + '14');
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Draw connections
      stars.forEach(star => {
        star.connections.forEach(connId => {
          const target = stars.find(s => s.id === connId);
          if (!target) return;
          const pulse = Math.sin(t + star.pulse) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(target.x, target.y);
          const grad = ctx.createLinearGradient(star.x, star.y, target.x, target.y);
          grad.addColorStop(0, star.color + Math.floor(pulse * 40 + 15).toString(16).padStart(2, '0'));
          grad.addColorStop(1, target.color + Math.floor(pulse * 30 + 10).toString(16).padStart(2, '0'));
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        });
      });

      // Draw stars
      stars.forEach(star => {
        const pulseFactor = Math.sin(t * 1.5 + star.pulse) * 0.3 + 0.7;
        const r = star.radius * pulseFactor;
        const isHovered = hoveredStar?.id === star.id;

        // Outer glow
        const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, r * (isHovered ? 6 : 4));
        glow.addColorStop(0, star.color + 'cc');
        glow.addColorStop(0.4, star.color + '44');
        glow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(star.x, star.y, r * (isHovered ? 6 : 4), 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(star.x, star.y, isHovered ? r * 1.8 : r, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? '#fff' : star.color;
        ctx.fill();

        // Label
        if (isHovered || zoom > 1.2) {
          ctx.font = `${isHovered ? 'bold ' : ''}${Math.max(10, 12 / zoom)}px Inter, sans-serif`;
          ctx.fillStyle = isHovered ? '#fff' : star.color + 'cc';
          ctx.textAlign = 'center';
          ctx.fillText(star.label, star.x, star.y - r * 2 - 4);
        }
      });

      ctx.restore();
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [hoveredStar, zoom, offset]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragging) {
      setOffset(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
      return;
    }
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Convert to constellation space
    const cx = canvas.width / 2 + offset.x;
    const cy = canvas.height / 2 + offset.y;
    const sx = (mx - cx) / zoom + 500;
    const sy = (my - cy) / zoom + 400;

    const hit = starsRef.current.find(s => Math.hypot(s.x - sx, s.y - sy) < 20);
    setHoveredStar(hit || null);
  };

  const DEMO_SKILLS = ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'Git', 'GraphQL', 'Redis', 'Next.js', 'MongoDB', 'Figma', 'Leadership', 'Agile', 'Go', 'Kubernetes', 'Jest'];

  const categories = Object.keys(CATEGORY_COLORS).filter(c => c !== 'default');

  return (
    <div className="h-screen mesh-bg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="glass-strong border-b border-white/5 h-14 flex items-center px-5 gap-4 shrink-0 z-10">
        <Link href={`/editor/${id}`} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Editor
        </Link>
        <div className="flex items-center gap-2 ml-1">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-bold text-white">Skill Constellation</span>
        </div>
        {portfolio && (
          <span className="text-slate-500 text-xs">— {portfolio.data?.name}</span>
        )}

        {/* Controls */}
        <div className="ml-auto flex items-center gap-2">
          {/* Category legend */}
          <div className="hidden md:flex items-center gap-3 mr-3">
            {categories.slice(0, 5).map(cat => (
              <div key={cat} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[cat] }} />
                <span className="text-xs text-slate-500 capitalize">{cat}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="btn-secondary text-xs py-1.5 px-3 gap-1">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))} className="btn-secondary text-xs py-1.5 px-3 gap-1">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }} className="btn-secondary text-xs py-1.5 px-3 gap-1">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredStar(null)}
          onMouseDown={e => { setDragging(true); dragStart.current = { x: e.clientX, y: e.clientY }; }}
          onMouseUp={() => setDragging(false)}
          onWheel={e => setZoom(z => Math.max(0.4, Math.min(3, z - e.deltaY * 0.001)))}
        />

        {/* Hovered star tooltip */}
        <AnimatePresence>
          {hoveredStar && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-strong rounded-2xl px-5 py-4 pointer-events-none border"
              style={{ borderColor: hoveredStar.color + '40' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: hoveredStar.color, boxShadow: `0 0 10px ${hoveredStar.color}` }} />
                <div>
                  <div className="text-white font-bold">{hoveredStar.label}</div>
                  <div className="text-xs capitalize mt-0.5" style={{ color: hoveredStar.color }}>{hoveredStar.category}</div>
                </div>
                <div className="text-slate-500 text-xs ml-4">
                  {hoveredStar.connections.length} connection{hoveredStar.connections.length !== 1 ? 's' : ''}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <div className="absolute top-4 right-4 glass rounded-xl px-3 py-2">
          <p className="text-xs text-slate-500">Scroll to zoom · Drag to pan · Hover stars</p>
        </div>

        {/* Skill count badge */}
        <div className="absolute top-4 left-4 glass rounded-xl px-3 py-2 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs text-white font-semibold">{starsRef.current.length} skills mapped</span>
        </div>
      </div>
    </div>
  );
}

const DEMO_SKILLS = ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'Git', 'GraphQL', 'Redis', 'Next.js', 'MongoDB', 'Figma', 'Leadership', 'Agile', 'Go', 'Kubernetes', 'Jest'];
