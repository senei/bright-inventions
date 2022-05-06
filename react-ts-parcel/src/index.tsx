import * as React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import GoogleMapReact from 'google-map-react'

// import { Button } from './Button'
import { useState, useEffect } from 'react'
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from 'websocket'
const client = new W3CWebSocket('ws://localhost:8085/cars')

const Pin = ({ text }: { lng: number; lat: number; text: string }) => (
  <div style={{ width: '100px' }}>&#10733; {text}</div>
)

const Map = ({
  location,
  zoomLevel,
  pins,
}: {
  location: { lng: number; lat: number }
  zoomLevel: number
  pins: [{ name: string; lng: number; lat: number }]
}) => (
  <GoogleMapReact
    bootstrapURLKeys={{ key: 'AIzaSyB1Dp7qFXG5Nz7sVlopi2uynq8PlDPcmJc' }}
    defaultCenter={location}
    defaultZoom={zoomLevel}
  >
    {pins.map((pin) => (
      <Pin lat={pin.lat} lng={pin.lng} text={pin.name} />
    ))}
  </GoogleMapReact>
)

const location = {
  lat: 54.37,
  lng: 18.6,
  name: 'center',
} // our location object from earlier

const App = () => {
  const [carsData, setCarsData] = useState(Array)
  const [filterString, setFilterString] = useState('car ')
  const [filteredData, setFilteredData] = useState(Array)
  const filterFun = (elem: { name: string }) =>
    elem.name.toLowerCase().includes(filterString)
  // web socket effect
  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected')
    }
    client.onmessage = (message: IMessageEvent) => {
      const _carsData: Array<object> = JSON.parse(message.data as string)
      setCarsData(_carsData)
      setFilteredData(_carsData.filter(filterFun))
    }
  }, [])
  // data modify effect
  useEffect(() => {
    setFilteredData(carsData.filter(filterFun))
  }, [filterString])
  return (
    <>
      <h4 style={{ display: 'inline-block' }}>filter:</h4>
      <input
        value={filterString}
        onChange={({ target }) => setFilterString(target.value)}
      />
      <div style={{ height: '320px', width: '480px' }}>
        <Map location={location} zoomLevel={8} pins={filteredData} />
      </div>
      <h4>Filtered elements in a list:</h4>
      <ul>
        {filteredData.map(
          (elem: { name: string; id: number; lat: number; lng: number }) => (
            <li key={elem.id}>
              {elem.name} - lat: {elem.lat}, lng: {elem.lng}
            </li>
          ),
        )}
      </ul>
    </>
  )
}
const _app = document.getElementById('app')
if (_app !== null) ReactDOMClient.createRoot(_app).render(<App />)
else console.error(_app + ' is null')
