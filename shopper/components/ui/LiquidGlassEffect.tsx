
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const VERTEX_SHADER = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uDisplacement;
  uniform float uAberration;
  uniform float uSaturation;
  uniform int uVariant; // 0 for classic, 1 for specy
  uniform bool uOverLight;
  uniform bool uShowCheckerboard;

  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) { 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857; 
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    if (uShowCheckerboard) {
        vec2 grid = floor(vUv * 20.0);
        float pattern = mod(grid.x + grid.y, 2.0);
        gl_FragColor = vec4(vec3(pattern), 1.0);
        return;
    }

    vec2 uv = vUv;
    float t = uTime * 0.2;
    vec3 finalColor;

    if (uVariant == 1) { // SPECY VARIANT
        float noiseBase = snoise(vec3(uv * uFrequency, t));
        float shift = uAberration * 0.02;
        float r = snoise(vec3((uv + vec2(shift, 0.0)) * uFrequency, t));
        float g = snoise(vec3(uv * uFrequency, t));
        float b = snoise(vec3((uv - vec2(shift, 0.0)) * uFrequency, t));

        vec2 refraction = vec2(r - g, b - g) * (uDisplacement * 0.12);
        vec2 refractedUv = uv + refraction;
        
        finalColor = mix(uColor1, uColor2, noiseBase * 0.5 + 0.5);
        finalColor = mix(finalColor, uColor3, b * 0.5 + 0.5);
        
        float spec = pow(max(0.0, g), 16.0) * 0.6;
        finalColor += spec;
    } else { // CLASSIC VARIANT (Background)
        float n1 = snoise(vec3(uv * (uFrequency * 0.4), t * 0.5));
        float n2 = snoise(vec3(uv * (uFrequency * 0.8) + vec2(t), t * 0.3));
        
        finalColor = mix(uColor1, uColor2, n1 * 0.5 + 0.5);
        finalColor = mix(finalColor, uColor3, n2 * 0.4 + 0.3);
    }

    float luma = dot(finalColor, vec3(0.299, 0.587, 0.114));
    finalColor = mix(vec3(luma), finalColor, uSaturation / 100.0);

    if (uOverLight) {
        finalColor *= 0.85;
    }

    gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
  }
`;

interface LiquidGlassEffectProps {
    className?: string;
    opacity?: number;
    variant?: 'classic' | 'specy';
}

export default function LiquidGlassEffect({ className = "", opacity = 1, variant = 'classic' }: LiquidGlassEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, mode, glassConfig } = useTheme();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: rect.height - (e.clientY - rect.top) };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getThemeColors = () => {
    const isDark = mode === 'dark';
    const primaryColors: Record<string, [number, number, number]> = {
      blue: [0.2, 0.5, 1.0], green: [0.1, 0.8, 0.4], purple: [0.6, 0.3, 1.0],
      orange: [1.0, 0.6, 0.1], red: [1.0, 0.2, 0.3], pink: [1.0, 0.3, 0.8],
      teal: [0.1, 0.7, 0.7], yellow: [1.0, 0.9, 0.1], indigo: [0.4, 0.4, 1.0], gray: [0.6, 0.6, 0.7],
    };
    const c = primaryColors[theme] || primaryColors.blue;
    if (isDark) {
      return {
        c1: [c[0] * 0.25, c[1] * 0.25, c[2] * 0.4],
        c2: [0.06, 0.07, 0.1],
        c3: [c[0] * 0.15, c[1] * 0.15, c[2] * 0.25],
      };
    }
    return {
      c1: [c[0] * 0.7, c[1] * 0.7, c[2] * 0.9],
      c2: [0.94, 0.95, 0.98],
      c3: [c[0] * 0.5, c[1] * 0.5, c[2] * 0.7],
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
    if (!gl) return;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    if (!program) return;
    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const locs = {
      uTime: gl.getUniformLocation(program, 'uTime'),
      uResolution: gl.getUniformLocation(program, 'uResolution'),
      uMouse: gl.getUniformLocation(program, 'uMouse'),
      uColor1: gl.getUniformLocation(program, 'uColor1'),
      uColor2: gl.getUniformLocation(program, 'uColor2'),
      uColor3: gl.getUniformLocation(program, 'uColor3'),
      uFrequency: gl.getUniformLocation(program, 'uFrequency'),
      uAmplitude: gl.getUniformLocation(program, 'uAmplitude'),
      uDisplacement: gl.getUniformLocation(program, 'uDisplacement'),
      uAberration: gl.getUniformLocation(program, 'uAberration'),
      uSaturation: gl.getUniformLocation(program, 'uSaturation'),
      uVariant: gl.getUniformLocation(program, 'uVariant'),
      uOverLight: gl.getUniformLocation(program, 'uOverLight'),
      uShowCheckerboard: gl.getUniformLocation(program, 'uShowCheckerboard'),
    };

    let animationId: number;
    const render = (time: number) => {
      if (!canvasRef.current) return;
      const colors = getThemeColors();
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
          canvas.width = rect.width; canvas.height = rect.height;
          gl.viewport(0, 0, canvas.width, canvas.height);
      }
      gl.useProgram(program);
      gl.uniform1f(locs.uTime, time * 0.001);
      gl.uniform2f(locs.uResolution, canvas.width, canvas.height);
      gl.uniform2f(locs.uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform3fv(locs.uColor1, colors.c1);
      gl.uniform3fv(locs.uColor2, colors.c2);
      gl.uniform3fv(locs.uColor3, colors.c3);
      gl.uniform1f(locs.uFrequency, glassConfig.frequency);
      gl.uniform1f(locs.uAmplitude, glassConfig.amplitude);
      gl.uniform1f(locs.uDisplacement, glassConfig.displacementScale);
      gl.uniform1f(locs.uAberration, glassConfig.chromaticAberration);
      gl.uniform1f(locs.uSaturation, glassConfig.saturation);
      gl.uniform1i(locs.uVariant, variant === 'specy' ? 1 : 0);
      gl.uniform1i(locs.uOverLight, glassConfig.overLight ? 1 : 0);
      gl.uniform1i(locs.uShowCheckerboard, glassConfig.showCheckerboard ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationId = requestAnimationFrame(render);
    };
    animationId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationId);
      gl.deleteProgram(program);
      gl.deleteBuffer(positionBuffer);
    };
  }, [theme, mode, glassConfig, variant]);

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} style={{ opacity }} />;
}
