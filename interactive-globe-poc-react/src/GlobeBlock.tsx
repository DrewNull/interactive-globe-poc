import { useEffect, useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
    AmbientLight,
    Camera,
    MathUtils,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Raycaster,
    Scene,
    SphereGeometry,
    Spherical,
    Sprite,
    SpriteMaterial,
    TextureLoader,
    Vector2,
    Vector3,
    WebGLRenderer,
} from 'three'

export function GlobeBlock() {
    const canvasRef = useRef<HTMLDivElement>(null)
    let autoRotate = true
    useEffect(() => {
        const radius = 1
        const camera = createCamera()
        const renderer = new WebGLRenderer()
        const globe = createGlobe(radius)
        const markers = createMarkers(radius)
        markers.forEach((marker) => globe.add(marker))
        setRendererSize(renderer)
        if (canvasRef.current && canvasRef.current.childNodes.length < 1) {
            canvasRef.current.appendChild(renderer.domElement)
        }
        addOrbitControls(camera, renderer)
        const raycaster = new Raycaster()
        const mouse = new Vector2()
        window.addEventListener(
            'resize',
            () => onWindowResize(camera, renderer),
            false
        )
        animate(renderer, createScene(globe), camera, globe)
    }, [])
    return (
        <>
            Hello World
            <div
                style={{
                    height: '0',
                    margin: 'auto',
                    paddingBottom: '50%',
                    position: 'relative',
                    width: '100%',
                }}
            >
                <div
                    ref={canvasRef}
                    onMouseDown={onMouseDown}
                    onMouseOut={onMouseOut}
                    onMouseOver={onMouseOver}
                    style={{
                        height: '100%',
                        position: 'absolute',
                        width: '100%',
                    }}
                ></div>
            </div>
        </>
    )
    function addOrbitControls(camera: Camera, renderer: WebGLRenderer) {
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enablePan = false
        controls.enableZoom = false
        controls.maxPolarAngle = Math.PI - Math.PI / 3
        controls.minPolarAngle = Math.PI / 3
    }
    function animate(
        renderer: WebGLRenderer,
        scene: Scene,
        camera: PerspectiveCamera,
        globe: Mesh<SphereGeometry, MeshBasicMaterial>
    ) {
        requestAnimationFrame(() => animate(renderer, scene, camera, globe))
        if (autoRotate) {
            globe.rotation.y += 0.00025
        }
        renderer.render(scene, camera)
    }
    function createCamera() {
        const camera = new PerspectiveCamera(30, 2, 0.1, 1000)
        camera.position.z = 5
        return camera
    }
    function createGlobe(radius: number) {
        const geometry = new SphereGeometry(radius, 64, 64)
        const material = new MeshBasicMaterial()
        const textureLoader = new TextureLoader()
        material.map = textureLoader.load('images/2_no_clouds_4k.jpg')
        const globe = new Mesh(geometry, material)
        globe.rotation.y = MathUtils.degToRad(-90)
        return globe
    }
    function createScene(globe: Mesh<SphereGeometry, MeshBasicMaterial>) {
        const scene = new Scene()
        scene.add(globe)
        scene.add(new AmbientLight(0xffffff))
        return scene
    }
    function createMarker(data: MarkerData, radius: number) {
        const spriteScale = 0.125
        const map = new TextureLoader().load(data.image)
        const material = new SpriteMaterial({ map: map })
        const sprite = new Sprite(material)
        // TODO: Remove. Get a new earth image that is left-aligned to the prime meridian
        data.lng = data.lng + 90
        var spherical = new Spherical(
            radius + spriteScale / 2,
            Math.PI * (0.5 - data.lat / 180),
            Math.PI * (data.lng / 180)
        )
        var vector = new Vector3()
        vector.setFromSpherical(spherical)
        sprite.position.set(vector.x, vector.y, vector.z)
        sprite.scale.set(spriteScale, spriteScale, spriteScale)
        return sprite
    }
    function createMarkers(radius: number) {
        return getMarkersData().map((data) => createMarker(data, radius))
    }
    function getMarkersData(): Array<MarkerData> {
        return [
            {
                image: 'images/web-map-icons_dc-on.png',
                lat: 41.881832,
                lng: -87.623177,
            },
            {
                image: 'images/web-map-icons_dc-on.png',
                lat: 29.5657,
                lng: 106.5512,
            },
        ]
    }
    function onMouseDown(event: any) {
        console.log('onMouseDown')
    }
    function onMouseOut(event: any) {
        autoRotate = true
    }
    function onMouseOver(event: any) {
        autoRotate = false
    }
    function onWindowResize(
        camera: PerspectiveCamera,
        renderer: WebGLRenderer
    ) {
        camera.updateProjectionMatrix()
        setRendererSize(renderer)
    }
    function setRendererSize(renderer: WebGLRenderer) {
        if (window) {
            renderer.setSize(window.innerWidth, window.innerWidth / 2)
        }
    }
}

type MarkerData = {
    lat: number
    lng: number
    image: string
}
