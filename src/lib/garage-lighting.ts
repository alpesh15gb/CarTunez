import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

// Two area lights, two unshadowed headlamps, no bloom pass or shadow maps.
// Every effect is attached to world geometry and respects the camera's view.
export function createGarageLighting(scene: THREE.Scene, car: THREE.Group) {
  RectAreaLightUniformsLib.init();
  const set = new THREE.Group(); scene.add(set);
  const lamps = new THREE.Group(); car.add(lamps);
  const concrete = new THREE.MeshStandardMaterial({ color: '#151b22', roughness: .88, metalness: .12 });
  const metal = new THREE.MeshStandardMaterial({ color: '#161d24', roughness: .55, metalness: .5 });
  const stripMaterials: THREE.MeshBasicMaterial[] = [];
  const box = (size: [number,number,number], position: [number,number,number], material: THREE.Material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material); mesh.position.set(...position); set.add(mesh); return mesh;
  };
  // Architectural portals give the camera a real foreground and vanishing point.
  [-11, -6, 6, 11].forEach(z => {
    box([15.4, .22, .24], [0, 4.3, z], metal);
    [-1, 1].forEach(side => box([.2, 4.3, .24], [side*7.6, 2.15, z], metal));
    const strip = new THREE.MeshBasicMaterial({ color: '#dce7ef', transparent: true, opacity: .1 }); stripMaterials.push(strip);
    box([12.8, .035, .09], [0, 4.17, z], strip);
  });
  [-1, 1].forEach(side => {
    // Portrait framing can move the camera farther back than the desktop rig.
    // Keep the entire fitted camera path INSIDE the room at every breakpoint.
    box([.15, 5.2, 42], [side*18, 2.6, 0], concrete);
    const strip = new THREE.MeshBasicMaterial({ color: side < 0 ? '#779aaf' : '#b84038', transparent: true, opacity: .1 }); stripMaterials.push(strip);
    box([.035, .04, 25], [side*5.4, .035, 0], strip);
  });
  box([36, 5.2, .2], [0, 2.6, 21], concrete);
  box([36, 5.2, .2], [0, 2.6, -21], concrete);
  const overhead = new THREE.RectAreaLight('#e4edf6', 0, 6, 1.4); overhead.position.set(0, 4.8, -.8); overhead.lookAt(0, .4, 0); scene.add(overhead);
  const softbox = new THREE.RectAreaLight('#99bed8', 0, 4, 2); softbox.position.set(-4, 2.5, -1); softbox.lookAt(0, .6, 0); scene.add(softbox);
  // A broad, physical light source remains visible overhead in wide shots.
  const ceilingMaterial = new THREE.MeshBasicMaterial({ color: '#e3edf7', transparent: true, opacity: 0 }); stripMaterials.push(ceilingMaterial);
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.4), ceilingMaterial); ceiling.rotation.x = Math.PI/2; ceiling.position.copy(overhead.position); set.add(ceiling);

  const textureCanvas = document.createElement('canvas'); textureCanvas.width = textureCanvas.height = 128;
  const context = textureCanvas.getContext('2d')!;
  const glow = context.createRadialGradient(64,64,0,64,64,64);
  glow.addColorStop(0,'rgba(230,246,255,1)'); glow.addColorStop(.08,'rgba(185,220,255,.8)'); glow.addColorStop(.3,'rgba(115,177,225,.18)'); glow.addColorStop(1,'rgba(80,135,200,0)');
  context.fillStyle=glow; context.fillRect(0,0,128,128);
  const glowMap = new THREE.CanvasTexture(textureCanvas);
  const headlightMaterials: { material: THREE.MeshStandardMaterial; color: THREE.Color; intensity: number }[] = [];
  const glassMaterials: { material: THREE.MeshStandardMaterial; opacity: number }[] = [];
  const rearMaterials: { material: THREE.MeshStandardMaterial; color: THREE.Color; intensity: number; map: THREE.Texture | null }[] = [];
  const flares: { group: THREE.Group; sprites: THREE.Sprite[]; spot: THREE.SpotLight }[] = [];
  const toCamera = new THREE.Vector3(), forward = new THREE.Vector3(), source = new THREE.Vector3();
  const iceWhite = new THREE.Color('#c8e4ff');

  function bindModel(model: THREE.Group) {
    const bounds = [new THREE.Box3(), new THREE.Box3()];
    model.updateMatrixWorld(true);
    model.traverse(node => {
      if (!(node instanceof THREE.Mesh)) return;
      const original = Array.isArray(node.material) ? node.material[0] : node.material;
      if (!(original instanceof THREE.MeshStandardMaterial)) return;
      if (!['HEADLIGHT','headlightsglass','BRAKELIGHT'].includes(original.name)) return;
      const material = original.clone(); node.material = material;
      if (material.name === 'HEADLIGHT') headlightMaterials.push({ material, color: material.emissive.clone(), intensity: material.emissiveIntensity });
      if (material.name === 'headlightsglass') glassMaterials.push({ material, opacity: material.opacity });
      if (material.name === 'BRAKELIGHT') rearMaterials.push({ material, color: material.emissive.clone(), intensity: material.emissiveIntensity, map: material.emissiveMap });
      if (material.name !== 'HEADLIGHT') return;
      const position = node.geometry.getAttribute('position'), point = new THREE.Vector3();
      for (let i=0; i<position.count; i++) {
        point.fromBufferAttribute(position,i).applyMatrix4(node.matrixWorld);
        const side = point.x < 0 ? 0 : 1;
        bounds[side].expandByPoint(point);
      }
    });
    bounds.forEach(bound => {
      if (bound.isEmpty()) return;
      const origin = bound.getCenter(new THREE.Vector3());
      // The optical source is the projector, not the leading tip of the lens.
      origin.z -= .025;
      const group = new THREE.Group(); group.position.copy(origin); lamps.add(group);
      const sprites = [[.32,.22],[1.0,.24],[1.7,.025]].map(([width,height],i) => {
        // Optical scattering overlays the lens. The source core keeps depth;
        // all scattering fades away when the camera leaves the frontal cone.
        const material = new THREE.SpriteMaterial({ map: glowMap, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: i === 0, toneMapped: false, opacity: 0 });
        const sprite = new THREE.Sprite(material); sprite.scale.set(width,height,1); group.add(sprite); return sprite;
      });
      const spot = new THREE.SpotLight('#d2e8ff',0,12,.32,.85,2); spot.position.copy(origin);
      spot.target.position.set(origin.x*1.15,.015,-7); lamps.add(spot,spot.target);
      flares.push({group,sprites,spot});
    });
  }

  function update(isHero: boolean, power: number, garage: number, progress: number, camera: THREE.Camera) {
    set.visible = isHero; lamps.visible = isHero;
    overhead.intensity = isHero ? 5.5*garage : 0;
    softbox.intensity = isHero ? 2.5*garage : 0;
    softbox.position.set(-4+garage*1.8,2.5,-1+Math.sin(progress*Math.PI)*.9); softbox.lookAt(0,.6,0);
    stripMaterials.forEach((material,i) => { material.opacity = .08 + garage*(i < 4 ? .62 : .35); });
    headlightMaterials.forEach(({material,color,intensity}) => {
      material.emissive.copy(isHero ? iceWhite : color);
      material.emissiveIntensity = isHero ? power*9 : intensity;
    });
    glassMaterials.forEach(({material,opacity}) => { material.opacity = isHero ? .36 : opacity; });
    rearMaterials.forEach(({material,color,intensity,map}) => {
      const nextMap = isHero ? material.map : map;
      if (material.emissiveMap !== nextMap) { material.emissiveMap=nextMap; material.needsUpdate=true; }
      if (isHero) { material.emissive.set('#ee2017'); material.emissiveIntensity=.4+THREE.MathUtils.smoothstep(progress,.5,.85)*1.6; }
      else { material.emissive.copy(color); material.emissiveIntensity=intensity; }
    });
    forward.set(0,0,-1).applyQuaternion(car.quaternion);
    flares.forEach(({group,sprites,spot}) => {
      group.getWorldPosition(source); toCamera.copy(camera.position).sub(source).normalize();
      const facing = THREE.MathUtils.smoothstep(forward.dot(toCamera),.08,.7);
      sprites.forEach((sprite,i) => { sprite.material.opacity = isHero ? power*facing*[.6,.28,.32][i] : 0; });
      spot.intensity = isHero ? power*38 : 0;
    });
  }
  return { bindModel, update, origins: () => flares.map(flare => flare.group.position.toArray().map(n=>n.toFixed(3)).join(',')).join(';') };
}
