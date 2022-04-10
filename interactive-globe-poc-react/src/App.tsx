import React from 'react'
import './App.css'
import { GlobeBlock } from './GlobeBlock'
import logo from './logo.svg'

function App() {
    return (
        <div className='App'>
            <GlobeBlock
                idleRotationSpeed={0.001}
                imageOffsetLng={90}
                imageUrl='images/2_no_clouds_4k.jpg'
                markers={[
                    {
                        image: 'images/web-map-icons_dc-on.png',
                        lat: 41.881832,
                        lng: -87.623177,
                        city: 'Chicago',
                    },
                    {
                        image: 'images/web-map-icons_ent-lan-wlan-ruckus-on.png',
                        lat: 29.5657,
                        lng: 106.5512,
                        city: 'Chongqing',
                    },
                ]}
                markerScale={0.175}
            />
        </div>
    )
}

export default App
