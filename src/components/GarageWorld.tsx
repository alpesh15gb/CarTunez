'use client';
import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { world } from '@/lib/world';
import { heroCamera, heroIgnition } from '@/lib/hero-camera';
import { createGarageLighting } from '@/lib/garage-lighting';



// One renderer and one decoded BMW, shared by the hero and the workshop.
// Rendering is invalidated by scroll/pointer/view changes and stops when settled.
export default function GarageWorld() {
  useEffect(() => {
    const main = document.getElementById('main');
    const heroSlot = document.querySelector<HTMLElement>('[data-world-slot="hero"]');
    const workshopSlot = document.querySelector<HTMLElement>('[data-world-slot="workshop"]');
    if (!main || !heroSlot || !workshopSlot) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', alpha: false }); }
    catch { main.dataset.webgl = 'unavailable'; window.dispatchEvent(new Event('cartunez:world-unavailable')); return; }
    let disposed = false, loaded = false, dirty = true, frames = 0, lastTime = 0, slowFrames = 0;
    let ignitionStartedAt: number | null = null;
    let previous = '', previousScene = '';
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#07090c');
    scene.fog = new THREE.Fog('#07090c', 12, 30);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1 : 1.5));
    renderer.domElement.className = 'garage-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
    const environment = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(environment, 0.04);
    scene.environment = env.texture;
    environment.dispose(); pmrem.dispose();
    const ambient = new THREE.HemisphereLight('#c9d4ed', '#111116', 0.7); scene.add(ambient);
    const rimMaterials: { material: THREE.MeshStandardMaterial; original: THREE.Color }[] = [];
    const key = new THREE.DirectionalLight('#e9f1ff', 1.8); key.position.set(5, 7, -3); scene.add(key);
    const rim = new THREE.DirectionalLight('#ff334b', 1.2); rim.position.set(-4, 2, 4); scene.add(rim);
    const fill = new THREE.DirectionalLight('#d9eaff', 2.2); fill.position.set(-4, 4, -5); scene.add(fill);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), new THREE.MeshPhysicalMaterial({ color: '#101820', roughness: .92, metalness: 0, envMapIntensity: .08, specularIntensity: .08 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -0.015; scene.add(floor);
    // A restrained studio plinth replaces the grid, keeping attention on the car.
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(3.45, 3.5, .07, 72), new THREE.MeshStandardMaterial({ color: '#15161b', metalness: .35, roughness: .65 }));
    plinth.position.y = -.06; scene.add(plinth);
    const studioRing = new THREE.Mesh(new THREE.RingGeometry(3.48, 3.49, 96), new THREE.MeshBasicMaterial({ color: '#775058', transparent: true, opacity: .35, side: THREE.DoubleSide }));
    studioRing.rotation.x = -Math.PI / 2; studioRing.position.y = -.02; scene.add(studioRing);
    const car = new THREE.Group(); scene.add(car);
    const garage = createGarageLighting(scene, car);
    // A small baked-style contact shadow grounds the car without live shadow maps.
    const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = 128; shadowCanvas.height = 256;
    const shadowContext = shadowCanvas.getContext('2d');
    if (shadowContext) {
      shadowContext.scale(1, 2);
      const gradient = shadowContext.createRadialGradient(64, 64, 12, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(0,0,0,.85)'); gradient.addColorStop(1, 'rgba(0,0,0,0)');
      shadowContext.fillStyle = gradient; shadowContext.fillRect(0, 0, 128, 128);
      const contact = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 5.5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false }));
      contact.rotation.x = -Math.PI / 2; contact.position.y = .003; scene.add(contact);
    }
    const anchors = [new THREE.Vector3(0, .24, -2.12), new THREE.Vector3(.94, .24, 0), new THREE.Vector3(0, 1.12, 1.8), new THREE.Vector3(0, .2, 2.1)];
    let viewAngle = world.workshopAngle;
    const draco = new DRACOLoader(); draco.setDecoderPath('/draco/'); draco.setWorkerLimit(1);
    const loader = new GLTFLoader(); loader.setDRACOLoader(draco);
    loader.load('/models/bmw-m6-gt3.glb?v=ec94b6b22388', gltf => {
      if (disposed) { disposeObject(gltf.scene); return; }
      gltf.scene.updateMatrixWorld(true);
      const bounds = new THREE.Box3();
      gltf.scene.traverse(node => {
        if (!(node instanceof THREE.Mesh)) return;
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach((material, index) => {
          if (material.name !== 'material_18' || !(material instanceof THREE.MeshStandardMaterial)) return;
          const clone = material.clone();
          if (Array.isArray(node.material)) node.material[index] = clone; else node.material = clone;
          rimMaterials.push({ material: clone, original: clone.color.clone() });
        });
        // The supplied file includes its own presentation floor. The studio has one already.
        if (materials.some(m => m.name === 'floor' || m.name === 'carshadow')) { node.visible = false; return; }
        bounds.union(new THREE.Box3().setFromObject(node));
      });
      const size = bounds.getSize(new THREE.Vector3()), center = bounds.getCenter(new THREE.Vector3());
      const scale = 4.6 / Math.max(size.x, size.z);
      gltf.scene.position.sub(new THREE.Vector3(center.x, bounds.min.y, center.z));
      const normalised = new THREE.Group(); normalised.add(gltf.scene); normalised.scale.setScalar(scale);
      normalised.rotation.y = Math.PI; car.add(normalised);
      garage.bindModel(normalised);
      loaded = true; dirty = true; main.dataset.webgl = 'ready';
      const heroStatus = main.querySelector('[data-hero-status]');
      if (heroStatus) heroStatus.textContent = 'LIVE 3D / SCROLL TO ORBIT';
      window.dispatchEvent(new Event('cartunez:world-ready'));
      main.querySelectorAll<HTMLElement>('[data-world-status]').forEach(el => { el.textContent = 'BMW M6 GT3 · INTERACTIVE STUDY'; });
    }, undefined, () => { if (!disposed) { main.dataset.webgl = 'unavailable'; window.dispatchEvent(new Event('cartunez:world-unavailable')); main.querySelectorAll<HTMLElement>('[data-world-status]').forEach(el => { el.textContent = 'GARAGE STUDY · SCROLL TO EXPLORE'; }); } });

    const markDirty = () => { dirty = true; };
    const reignite = () => { ignitionStartedAt = null; dirty = true; };
    const cameraTarget = new THREE.Vector3(), desired = new THREE.Vector3();
    const tick = () => {
      if (disposed || document.hidden || !loaded) return;
      const stateKey = `${world.hero.toFixed(5)}:${world.workshopActive}:${world.workshopAngle.toFixed(4)}:${world.workshopLight}:${world.rim}`;
      if (stateKey !== previous) { dirty = true; previous = stateKey; }
      if (!dirty) return;
      const heroRect = heroSlot.getBoundingClientRect(), workshopRect = workshopSlot.getBoundingClientRect();
      const inView = (r: DOMRect) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight;
      const isHero = inView(heroRect);
      const slot = isHero ? heroSlot : world.workshopActive && inView(workshopRect) ? workshopSlot : null;
      if (!slot) { renderer.domElement.style.visibility = 'hidden'; dirty = false; return; }
      if (renderer.domElement.parentElement !== slot) slot.appendChild(renderer.domElement);
      renderer.domElement.style.visibility = 'visible';
      const r = slot.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const canvas = renderer.domElement;
      if (Number(canvas.dataset.width) !== Math.round(r.width) || Number(canvas.dataset.height) !== Math.round(r.height)) {
        renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix();
        canvas.dataset.width = String(Math.round(r.width)); canvas.dataset.height = String(Math.round(r.height));
      }
      const angle = world.workshopAngle;
      const shot = heroCamera(world.hero);
      const now = performance.now();
      if (isHero && ignitionStartedAt === null) ignitionStartedAt = now;
      const ignitionAge = ignitionStartedAt === null ? 0 : (now-ignitionStartedAt)/1000;
      const ignition = heroIgnition(ignitionAge);
      // A small opening dolly blends out as soon as scroll takes over.
      const entrance = isHero ? (1-ignition.camera)*(1-THREE.MathUtils.smoothstep(world.hero,0,.12)) : 0;
      const frameWidth = 2.2 + .25 * Math.abs(Math.sin(shot.angle + shot.turn));
      const shortWide = innerWidth >= 500 && innerWidth < 761 && innerHeight < 560;
      const distance = isHero ? Math.max(shot.radius * (shortWide ? .65 : 1), frameWidth / (Math.tan(THREE.MathUtils.degToRad(36 / 2)) * camera.aspect)) : r.width < 600 ? 7.3 : 6.7;
      camera.fov = isHero ? 36 : r.width < 600 ? 42 : 38;
      viewAngle = THREE.MathUtils.lerp(viewAngle, angle, .12);
      if (isHero) {
        const angle = shot.angle - entrance*.12, radius = distance + entrance*.7;
        desired.set(Math.sin(angle) * radius, shot.height+entrance*.12, -Math.cos(angle) * radius);
        // Optical framing, not a transformed canvas: leave space for the headline.
        const wide = innerWidth >= 761;
        const offsetX = wide ? (innerWidth < 1000 ? .13 : .17) * (1 - world.hero) : 0;
        camera.setViewOffset(r.width, r.height, -r.width * offsetX, 0, r.width, r.height);
      } else {
        camera.clearViewOffset();
        desired.set(Math.sin(viewAngle) * distance, 2.15, -Math.cos(viewAngle) * distance);
      }
      const day = !isHero && world.workshopLight === 'day';
      (scene.background as THREE.Color).set(day ? '#252c34' : isHero ? '#080d13' : '#07090c');
      (scene.fog as THREE.Fog).color.set(day ? '#252c34' : isHero ? '#080d13' : '#07090c');
      floor.material.color.set(day ? '#252c34' : isHero ? '#141d25' : '#0b0e12');
      plinth.material.color.set(day ? '#3b434d' : '#151a20');
      const room = ignition.garage;
      ambient.intensity = day ? 2 : isHero ? .1+room*.28 : .7;
      key.intensity = day ? 3 : isHero ? .12+room*1.1 : 1.8;
      fill.intensity = day ? 3 : isHero ? .15+room*.55 : 2.2;
      rim.intensity = day ? .25 : isHero ? .7+room*1.15 : 1.2;
      // Darker environment plus broad area lights gives shape without chrome glare.
      scene.environmentIntensity = isHero ? .18+room*.42 : 1;
      scene.environmentRotation.y = isHero ? -.35 + world.hero*.45 : 0;
      renderer.toneMappingExposure = day ? 1.45 : isHero ? 1.05+room*.13 : 1.2;
      plinth.visible = !isHero; studioRing.visible = !isHero;
      const finish = isHero ? 'original' : world.rim;
      const finishColors: Record<string, string> = { silver: '#b7bdc5', graphite: '#30343a', bronze: '#ae8154' };
      rimMaterials.forEach(({ material, original }) => { if (finishColors[finish]) material.color.set(finishColors[finish]); else material.color.copy(original); });
      camera.position.copy(desired); cameraTarget.set(0, isHero ? shot.target : .65, 0); camera.lookAt(cameraTarget); camera.updateProjectionMatrix();
      car.rotation.y = isHero ? shot.turn : 0; car.position.y = 0;
      garage.update(isHero, ignition.headlights, room, world.hero, camera);
      const workshopAnchors = [anchors[0], anchors[1], anchors[2]];
      if (!isHero) slot.parentElement?.querySelectorAll<HTMLElement>('[data-workshop-hotspot]').forEach((label, i) => {
        const point = workshopAnchors[i].clone().project(camera);
        label.style.left = `${THREE.MathUtils.clamp((point.x * .5 + .5) * 100, 9, 81)}%`;
        label.style.top = `${THREE.MathUtils.clamp((-point.y * .5 + .5) * 100, 22, 75)}%`;
      });
      const sceneName = isHero ? 'hero' : 'workshop';
      if (previousScene === sceneName && lastTime && now - lastTime > 34 && now - lastTime < 200) slowFrames++; else slowFrames = Math.max(0, slowFrames - 1);
      if (slowFrames > 35 && renderer.getPixelRatio() > 1) { renderer.setPixelRatio(1); slowFrames = 0; }
      lastTime = now;
      renderer.render(scene, camera); frames++;
      canvas.dataset.scene = sceneName; previousScene = sceneName;
      canvas.dataset.angle = (isHero ? shot.angle : viewAngle).toFixed(3); canvas.dataset.frames = String(frames); canvas.dataset.lighting = day ? 'day' : 'midnight'; canvas.dataset.rim = finish;
      canvas.dataset.camera = camera.position.toArray().map(n => n.toFixed(3)).join(',');
      canvas.dataset.target = cameraTarget.toArray().map(n => n.toFixed(3)).join(',');
      canvas.dataset.carRotation = car.rotation.y.toFixed(3);
      canvas.dataset.progress = world.hero.toFixed(3);
      canvas.dataset.headlights = (isHero ? ignition.headlights : 0).toFixed(3);
      canvas.dataset.garageLighting = (isHero ? room : 1).toFixed(3);
      canvas.dataset.ignition = isHero ? ignition.complete ? 'complete' : 'starting' : 'workshop';
      canvas.dataset.headlampOrigins = garage.origins();
      dirty = (isHero && !ignition.complete) || (!isHero && Math.abs(viewAngle - angle) > .001);
    };
    function contextLost(e: Event) { e.preventDefault(); loaded = false; renderer.domElement.style.visibility = 'hidden'; main!.dataset.webgl = 'unavailable'; const status = main!.querySelector('[data-hero-status]'); if (status) status.textContent = 'BMW M6 GT3 / IMAGE REFERENCE'; window.dispatchEvent(new Event('cartunez:world-unavailable')); }
    window.addEventListener('scroll', markDirty, { passive: true }); window.addEventListener('resize', markDirty); window.addEventListener('cartunez:view', markDirty); window.addEventListener('cartunez:reignite', reignite); document.addEventListener('visibilitychange', markDirty);
    gsap.ticker.add(tick);
    return () => {
      disposed = true; gsap.ticker.remove(tick); window.removeEventListener('scroll', markDirty); window.removeEventListener('resize', markDirty); window.removeEventListener('cartunez:view', markDirty); window.removeEventListener('cartunez:reignite', reignite); document.removeEventListener('visibilitychange', markDirty);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost); renderer.domElement.remove(); draco.dispose(); env.dispose(); disposeObject(scene); renderer.dispose(); renderer.forceContextLoss(); delete main.dataset.webgl;
      const status = main.querySelector('[data-hero-status]'); if (status) status.textContent = 'BMW M6 GT3 / REFERENCE STUDY';
    };
  }, []);
  return null;
}

function disposeObject(object: THREE.Object3D) {
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  object.traverse(node => { if (node instanceof THREE.Mesh || node instanceof THREE.LineSegments || node instanceof THREE.Sprite) { if ('geometry' in node) node.geometry.dispose(); const list = Array.isArray(node.material) ? node.material : [node.material]; list.forEach(m => materials.add(m)); } });
  materials.forEach(m => { Object.values(m).forEach(value => { if (value instanceof THREE.Texture) textures.add(value); }); m.dispose(); });
  textures.forEach(texture => texture.dispose());
}
