import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {TattosService} from '../../services/tattos.service';

@Component({
  selector: 'app-background-threejs',
  templateUrl: './background-threejs.component.html',
  styleUrls: ['./background-threejs.component.css']
})
export class BackgroundThreejsComponent implements OnInit {
  @ViewChild('tmpl', {static: true}) tmpl: ElementRef<HTMLCanvasElement>;
  tattoos: string[] = [
    'assets/tattoos/tattoo01.png',
    'assets/tattoos/tattoo02.png',
    'assets/tattoos/tattoo03.png',
    'assets/tattoos/tattoo04.png',
    'assets/tattoos/tattoo05.png',
    'assets/tattoos/tattoo06.png',
    'assets/tattoos/tattoo07.png',
    'assets/tattoos/tattoo08.png',
    'assets/tattoos/tattoo09.png',
    'assets/tattoos/tattoo10.png',
    'assets/tattoos/tattoo11.png',
    'assets/tattoos/tattoo13.png'
  ];
  selectedTattoo = 'assets/peace.png';
  showed = false;
  constructor(private readonly zone: NgZone, private _tattoosService: TattosService) {

    this.selectedTattoo = localStorage.getItem('select') ? localStorage.getItem('select') : 'assets/peace.png';
  }

  select(img: string): void{
    this.selectedTattoo = img;
    localStorage.setItem('select', img);
    location.reload();
  }
  verLeePerry(): void{
    location.reload();
  }

  ngOnInit(): void {

    // this.tattoos = this.getTattoos();

    const renderer = new THREE.WebGLRenderer({
      canvas: this.tmpl.nativeElement,
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    this.zone.runOutsideAngular(() => {
      // const container = document.getElementById( 'container' );
      let renderer, scene, camera, stats;
      renderer = new THREE.WebGLRenderer({
        canvas: this.tmpl.nativeElement,
      });
      let mesh;
      let raycaster;
      let line;

      const intersection = {
        intersects: false,
        point: new THREE.Vector3(),
        normal: new THREE.Vector3()
      };

      const mouse = new THREE.Vector2();
      const intersects = [];
      const textureLoader = new THREE.TextureLoader();
      const decalDiffuse = textureLoader.load(this.selectedTattoo);
      const decalNormal = textureLoader.load(this.selectedTattoo);

      const decalMaterial = new THREE.MeshPhongMaterial( {
        specular: 0x444444,
        map: decalDiffuse,
        normalMap: decalNormal,
        normalScale: new THREE.Vector2( 1, 1 ),
        shininess: 15,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: - 4,
        wireframe: false
      } );

      const decals = [];
      let mouseHelper;
      const position = new THREE.Vector3();
      const orientation = new THREE.Euler();
      const size = new THREE.Vector3( 10, 10, 10 );

      const params = {
        minScale: 10,
        maxScale: 20,
        rotate: true,
        clear() {

          removeDecals();

        }
      };

      window.addEventListener( 'load', init );

      function init() {
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        stats = new Stats();
        // container.appendChild( stats.dom );

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 120;

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.minDistance = 50;
        controls.maxDistance = 200;

        scene.add( new THREE.AmbientLight( 0x443333 ) );

        const dirLight1 = new THREE.DirectionalLight( 0xffddcc, 1 );
        dirLight1.position.set( 1, 0.75, 0.5 );
        scene.add( dirLight1 );

        const dirLight2 = new THREE.DirectionalLight( 0xccccff, 1 );
        dirLight2.position.set( - 1, 0.75, - 0.5 );
        scene.add( dirLight2 );

        const geometry = new THREE.BufferGeometry();
        geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );

        line = new THREE.Line( geometry, new THREE.LineBasicMaterial() );
        scene.add( line );

        loadLeePerrySmith();

        raycaster = new THREE.Raycaster();

        mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
        mouseHelper.visible = false;
        scene.add( mouseHelper );

        window.addEventListener( 'resize', onWindowResize );

        let moved = false;

        controls.addEventListener( 'change', function() {

          moved = true;

        } );

        window.addEventListener( 'pointerdown', function() {

          moved = false;

        } );

        window.addEventListener( 'pointerup', function( event ) {

          if ( moved === false ) {

            checkIntersection( event.clientX, event.clientY - 200 );

            if ( intersection.intersects ) { shoot(); }

          }

        } );

        window.addEventListener( 'pointermove', onPointerMove );

        function onPointerMove( event ) {

          if ( event.isPrimary ) {

            checkIntersection( event.clientX, event.clientY - 200 );

          }

        }

        function checkIntersection( x, y ) {

          if ( mesh === undefined ) { return; }

          mouse.x = ( x / window.innerWidth ) * 2 - 1;
          mouse.y = - ( y / window.innerHeight ) * 2 + 1;

          raycaster.setFromCamera( mouse, camera );
          raycaster.intersectObject( mesh, false, intersects );

          if ( intersects.length > 0 ) {

            const p = intersects[ 0 ].point;
            mouseHelper.position.copy( p );
            intersection.point.copy( p );

            const n = intersects[ 0 ].face.normal.clone();
            n.transformDirection( mesh.matrixWorld );
            n.multiplyScalar( 10 );
            n.add( intersects[ 0 ].point );

            intersection.normal.copy( intersects[ 0 ].face.normal );
            mouseHelper.lookAt( n );

            const positions = line.geometry.attributes.position;
            positions.setXYZ( 0, p.x, p.y, p.z );
            positions.setXYZ( 1, n.x, n.y, n.z );
            positions.needsUpdate = true;

            intersection.intersects = true;

            intersects.length = 0;

          } else {

            intersection.intersects = false;

          }

        }
        onWindowResize();
        animate();

      }

      function loadLeePerrySmith() {

        const loader = new GLTFLoader();

        loader.load( 'assets/model3D/LeePerrySmith.glb', function( gltf ) {

          mesh = gltf.scene.children[ 0 ];
          mesh.material = new THREE.MeshPhongMaterial( {
            specular: 0x111111,
            map: textureLoader.load( 'assets/model3D/Map-COL.jpg' ),
            specularMap: textureLoader.load( 'assets/model3D/Map-SPEC.jpg' ),
            normalMap: textureLoader.load( 'assets/model3D/Infinite-Level_02_Tangent_SmoothUV.jpg' ),
            shininess: 25
          } );

          scene.add( mesh );
          mesh.scale.set( 9, 9, 9 );

        } );

      }

      function shoot() {

        position.copy( intersection.point);
        orientation.copy( mouseHelper.rotation );

        // if ( params.rotate ) orientation.z = Math.random() * 2 * Math.PI;

        const scale = params.minScale; // + Math.random() * ( params.maxScale - params.minScale );
        size.set( scale, scale, scale );

        const material = decalMaterial.clone();
        // material.color.setHex( Math.random() * 0xffffff );

        const m = new THREE.Mesh( new DecalGeometry( mesh, position, orientation, size ), material );

        decals.push( m );
        scene.add( m );

      }

      function removeDecals() {

        decals.forEach( function( d ) {

          scene.remove( d );

        } );

        decals.length = 0;

      }

      function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

      }
      const animate = () => {

          requestAnimationFrame(animate);

          renderer.render(scene, camera);

          stats.update();
        };
    });
    if (document.readyState === 'complete'){
      this.verLeePerry();
    }
  }
}
