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

export interface GlobeMarkerData {
    city: string
    image: string
    lat: number
    lng: number
}

export interface GlobeBlockProps {
    idleRotationSpeed: number
    /** Longitude offset in degress to account for globe images that are not left-aligned to the prime meridian */
    imageOffsetLng: number
    imageUrl: string
    markers: Array<GlobeMarkerData>
    markerScale: number
}

export function GlobeBlock(props: GlobeBlockProps) {
    const canvasRef = useRef<HTMLDivElement>(null)
    let autoRotate = true
    const globeRadius = 1
    const renderer = new WebGLRenderer({ alpha: true })
    const camera = createCamera()
    const globe = createGlobe(globeRadius)
    const markers = createMarkers(globeRadius)
    markers.forEach((marker) => globe.add(marker))
    setRendererSize(renderer)
    addOrbitControls(camera, renderer)
    useEffect(() => {
        if (canvasRef.current && canvasRef.current.childNodes.length < 1) {
            canvasRef.current.appendChild(renderer.domElement)
        }
        window.addEventListener(
            'resize',
            () => onWindowResize(camera, renderer),
            false
        )
        animate(createScene(globe))
    }, [])
    return (
        <>
            Globe Demo
            <div
                style={{
                    backgroundColor: '#eee',
                    height: '0',
                    margin: 'auto',
                    paddingBottom: '50%',
                    position: 'relative',
                    width: '100%',
                }}
            >
                <div
                    ref={canvasRef}
                    onMouseDown={(event) =>
                        onMouseDown(event, camera, renderer, globe, markers)
                    }
                    onMouseOut={() => {
                        autoRotate = true
                    }}
                    onMouseOver={() => {
                        autoRotate = false
                    }}
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
    function animate(scene: Scene) {
        requestAnimationFrame(() => animate(scene))
        if (autoRotate) {
            globe.rotation.y += props.idleRotationSpeed ?? 0
        }
        renderer.render(scene, camera)
    }
    function createCamera() {
        const camera = new PerspectiveCamera(30, 2, 0.1, 1000)
        camera.position.z = 5
        return camera
    }
    function createGlobe(globeRadius: number) {
        const globe = new Mesh(
            new SphereGeometry(globeRadius, 64, 64),
            new MeshBasicMaterial({
                map: new TextureLoader().load(props.imageUrl),
            })
        )
        globe.rotation.y = MathUtils.degToRad(-1 * props.imageOffsetLng)
        return globe
    }
    function createScene(globe: Mesh<SphereGeometry, MeshBasicMaterial>) {
        const scene = new Scene()
        scene.add(globe)
        scene.add(new AmbientLight('#fff'))
        return scene
    }
    function createMarker(data: GlobeMarkerData, globeRadius: number) {
        const markerScale = props.markerScale ?? 1
        const lng = data.lng + props.imageOffsetLng
        const vector = new Vector3()
        vector.setFromSpherical(
            new Spherical(
                globeRadius + markerScale / 2,
                Math.PI * (0.5 - data.lat / 180),
                Math.PI * (lng / 180)
            )
        )
        const sprite = new Sprite(
            new SpriteMaterial({
                map: new TextureLoader().load(data.image),
            })
        )
        sprite.position.set(vector.x, vector.y, vector.z)
        sprite.scale.set(markerScale, markerScale, markerScale)
        sprite.userData = {
            city: data.city,
        }
        return sprite
    }
    function createMarkers(globeRadius: number) {
        return props.markers.map((data) => createMarker(data, globeRadius))
    }
    function onMouseDown(
        event: any,
        camera: Camera,
        renderer: WebGLRenderer,
        globe: Mesh<SphereGeometry, MeshBasicMaterial>,
        markers: Array<Sprite>
    ) {
        event.preventDefault()
        const raycaster = new Raycaster()
        const mouse = new Vector2()
        const rect = event.target.getBoundingClientRect()
        const element = renderer.domElement
        mouse.x = ((event.clientX - rect.left) / element.clientWidth) * 2 - 1
        mouse.y = -((event.clientY - rect.top) / element.clientHeight) * 2 + 1
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster
            .intersectObjects([globe, ...markers], false)
            .filter((intersect) => intersect.object.type === 'Sprite')
        if (intersects.length > 0) {
            console.log(intersects[0])
            alert(intersects[0].object.userData.city)
        }
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
