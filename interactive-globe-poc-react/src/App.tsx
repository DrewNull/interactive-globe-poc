import React, { useRef, useState } from "react"
import "./App.css"
import { GlobeBlock, GlobeMarkerData } from "./GlobeBlock"

function App() {
    const chicago: GlobeMarkerData = {
        image: '/interactive-globe-poc/images/web-map-icons_dc-on.png',
        lat: 41.881832,
        lng: -87.623177,
        city: 'Chicago, USA. Lorem ipsum...',
    }
    const chongqing: GlobeMarkerData = {
        image: '/interactive-globe-poc/images/web-map-icons_ent-lan-wlan-ruckus-on.png',
        lat: 29.5657,
        lng: 106.5512,
        city: 'Chongqing, China. Lorem ipsum...',
    }
    const [markers, setMarkers] = useState<GlobeMarkerData[]>()
    const markerCountInputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState<boolean>(false)
    return (
        <div className='App'>
            <div>
                {!loading && (
                    <GlobeBlock
                        idleRotationSpeed={0.001}
                        imageOffsetLng={90}
                        imageUrl='/interactive-globe-poc/images/2_no_clouds_4k.jpg'
                        markers={markers ?? []}
                        markerScale={0.05}
                    />
                )}
            </div>
            <div className='description'>
                <form
                    onSubmit={(event) => {
                        event.preventDefault()
                        loadMarkers(
                            parseInt(markerCountInputRef.current?.value ?? '0')
                        )
                    }}
                >
                    <label>
                        Marker Count:{' '}
                        <input ref={markerCountInputRef} type='number' />
                    </label>
                    <button type='submit'>Submit</button>
                </form>
                <p>
                    This is a simple interactive globe proof-of-concept demo
                    using{' '}
                    <a
                        href='https://threejs.org'
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        Three.js
                    </a>
                    . The approach taken by this POC is to establish a Three.js
                    foundation that can be extended with other features, such as
                    different geometry and behaviors. Note that the earth globe
                    image, among other things, would be authorable in the CMS.
                </p>
                <p>
                    <a
                        href='https://github.com/DrewNull/interactive-globe-poc/tree/main/interactive-globe-poc-react'
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        Source code on GitHub
                    </a>
                </p>
                <h4>Controls</h4>
                <p>
                    Hover over the canvas to pause the animation; click and drag
                    the globe to rotate. The "orbit" rotation controls have been
                    restricted to anchor the globe at the north and south poles.
                    Otherwise it has a "trackball" feel.
                </p>
                <h4>Markers</h4>
                <p>
                    Click the markers for more info. Presently, the markers open
                    an alert dialog when clicked, showing the city's name. This
                    functionality is only to illustrate that the 3D globe can
                    interact with the JavaScript of the parent page. In
                    practice, they would reveal Google Maps-like info windows,
                    or interacting with a list on the page (something like
                    that).
                </p>
                <p>
                    The markers would need to be authorable in the CMS. Here,
                    the content editors could upload an image, specify a
                    name/title, and specify the content to reveal upon click.
                </p>
            </div>
        </div>
    )
    function loadMarkers(count: number) {
        if (count > 9999) {
            alert("That's not a good idea...")
            return
        }
        setLoading(true)
        const newMarkers = [...Array(count)].map((x, i) => {
            return {
                city: `Marker #${i + 1}`,
                image: '/interactive-globe-poc/images/web-map-icons_dc-on.png',
                lat: Math.random() * 180 - 90,
                lng: Math.random() * 360 - 180,
            } as GlobeMarkerData
        })
        setMarkers((prev) => newMarkers)
        setTimeout(() => {
            setLoading(false)
        }, 0)
    }
}

export default App
