import * as THREE from 'three';
import metaversefile from 'metaversefile';
const {useApp, useFrame, useLoaders, usePhysics, useCleanup, useLocalPlayer, useCamera} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

export default () => {
  const app = useApp();
  const physics = usePhysics();
  const localPlayer = useLocalPlayer();
  const camera = useCamera();

  app.name = 'tilegen';

  let numTiles = 10;
  let tileInstance = null;

  let tiles = [];


  let lenX = 50;
  let lenZ = 50;

  function getRow(currentTile, tilesHoriz) {
		return Math.floor(currentTile / tilesHoriz);
	};

	function getColumn(currentTile, tilesHoriz) {
		return currentTile % tilesHoriz;
	};

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

  useFrame(() => {

    tiles.forEach(tile => {
      // let tilesHoriz = 8;
      // let tilesVert = 8;

      // //let tileIndex = getRandomInt(0, (8*8) - 1);

      // let indexHoriz = 4;
      // let indexVert = 4;
      // tile.material.map.offset.x = ( indexHoriz / tilesHoriz );
      // tile.material.map.offset.y = (tilesVert - indexVert -1 ) / tilesVert;
    });


  });
  

  let physicsIds = [];
  (async () => {
    const u = `${baseUrl}tiles/grass.png`;
    let o = await new Promise((accept, reject) => {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(u, accept, function onprogress() {}, reject);
    });

    o.wrapT = THREE.RepeatWrapping;
		o.wrapS = THREE.RepeatWrapping;
		o.repeat.set( 1/8, 1/8 );

    o.needsUpdate = true;

    let mainCol = new THREE.PlaneGeometry(500,500);
    let mainMat = new THREE.MeshBasicMaterial();
    let mainMesh = new THREE.Mesh(mainCol, mainMat);
    mainMesh.rotation.x = -Math.PI/2;
    
    let physicsId = physics.addGeometry(mainMesh);
    physicsIds.push(physicsId);

    //tilePrefab.rotation.x = Math.PI / 2;

    for (let x = 0; x < lenX; x++) {
      for (let z = 0; z < lenZ; z++) {
        //let tile = tilePrefab.clone();

        let textr = o.clone();
        textr.needsUpdate = true;

        const geometry = new THREE.PlaneGeometry( 1, 1 );
        const material = new THREE.MeshBasicMaterial( {map: textr, side: THREE.DoubleSide, wireframe: false} );
        let tile = new THREE.Mesh( geometry, material );

        tile.rotation.x = -Math.PI / 2;
        tile.position.x += x;
        tile.position.z += z
        app.add(tile);
        tiles.push(tile);
        app.updateMatrixWorld();

        //let physicsId = physics.addGeometry(tile);
        //physicsIds.push(physicsId);
        
      }

      //let physicsId = physics.addGeometry(tile);
      //physicsIds.push(physicsId);
    }

    app.position.set(-lenX/2, 0, -lenZ/2);

    tiles.forEach(tile => {
      let tilesHoriz = 8;
      let tilesVert = 8;
      let tileLength = tilesHoriz * tilesVert;

      //let tileIndex = getRandomInt(0, (8*8) - 1);

      let indexHoriz = getRandomInt(0, tileLength);
      let indexVert = getRandomInt(0, tileLength);

      //let rock = 0;

      //let indexHoriz = 3;
      //let indexVert = 1;
      //console.log(indexHoriz, indexVert)
      tile.material.map.offset.x = ( indexHoriz / tilesHoriz );
      tile.material.map.offset.y = (tilesVert - indexVert -1 ) / tilesVert;
    });

    //console.log(app);

    // let physicsId = physics.addGeometry(app);
    // physicsIds.push(physicsId);
    
    // let tempObj = new THREE.Object3D;
    // tiles.forEach(child => {
      
    // });

    // tileInstance = new THREE.InstancedMesh(new THREE.PlaneGeometry( 1, 1 ), new THREE.MeshStandardMaterial( {side: THREE.DoubleSide,  transparent: true, map: o} ), numTiles);
    // app.add(tileInstance);

    // for (let i = 0; i < tileInstance.count; i++) {
    //   // we add 200 units of distance (the width of the section) between each.
    //   // var xStaticPosition = (-sectionWidth + Math.random()) * (i - 1)
    //   // dummy.position.set(xStaticPosition, Math.random() * 10, 0);
    //   // dummy.updateMatrix();
    //   // mesh.setMatrixAt( i, dummy.matrix );
    // }
    // tileInstance.instanceMatrix.needsUpdate = true;

    
    //tiles.push(tile);
    //app.add( tile );


  })();

  return app;
};
