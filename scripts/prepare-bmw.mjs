import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, draco, textureCompress } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import sharp from 'sharp';
import { copyFile, stat } from 'node:fs/promises';

const source = process.argv[2];
if (!source) throw new Error('Pass the absolute path to the user-supplied BMW GLB.');
await copyFile(source, 'assets/source/bmw-m6-gt3-original.glb');
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.encoder': await draco3d.createEncoderModule(),
  'draco3d.decoder': await draco3d.createDecoderModule(),
});
const document = await io.read(source);
// Technical transfer optimization only: keep every mesh, original artwork and material.
await document.transform(dedup(), textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [1024, 1024], quality: 88 }), draco({ encodeSpeed: 5, decodeSpeed: 8 }));
await io.write('public/models/bmw-m6-gt3.glb', document);
console.log(JSON.stringify({ originalBytes: (await stat(source)).size, webBytes: (await stat('public/models/bmw-m6-gt3.glb')).size }));
