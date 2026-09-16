import { describe, test, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import OperationalMap
    from '../../components/dashboard/OperationalMap.vue'


// =====================================================
// MOCK DE LEAFLET
// =====================================================

// Mock de fitBounds()
const fitBounds = vi.fn()

// Mock de setView()
const setView = vi.fn()

// Mock del mapa
const mapMock = {

    setView,

    fitBounds,

    invalidateSize: vi.fn(),

    remove: vi.fn()

}


vi.mock('leaflet', () => ({

    default: {

        // Simulamos L.map()
        map: vi.fn(() => mapMock),


        // Simulamos L.divIcon()
        divIcon: vi.fn((options) => options),


        // Simulamos L.marker()
        marker: vi.fn(() => ({

            addTo: vi.fn().mockReturnThis(),

            bindPopup: vi.fn().mockReturnThis(),

            setLatLng: vi.fn(),

            setIcon: vi.fn(),

            setPopupContent: vi.fn(),

            getElement: vi.fn()

        })),


        // Simulamos L.latLngBounds()
        latLngBounds: vi.fn(
            (coordinates) => coordinates
        ),


        // Simulamos el control de zoom
        control: {

            zoom: vi.fn(() => ({

                addTo: vi.fn()

            }))

        },


        // Simulamos el mapa de Carto
        tileLayer: vi.fn(() => ({

            addTo: vi.fn()

        }))

    }

}))


describe('OperationalMap', () => {


    // =====================================================
    // TEST 1
    // Comprueba que el contenedor del mapa existe
    // =====================================================

    test('should render the map container', () => {

        const wrapper = mount(OperationalMap)

        const mapElement =
            wrapper.find('#operational-map')

        expect(mapElement.exists()).toBe(true)

    })


    // =====================================================
    // TEST 2
    // Comprueba que aparece LIVE DATA
    // =====================================================

    test('should display live data indicator', () => {

        const wrapper = mount(OperationalMap)

        expect(wrapper.text())
            .toContain('LIVE DATA')

    })


    // =====================================================
    // TEST 3
    // Comprueba que aparece la leyenda
    // =====================================================

    test('should display the asset legend', () => {

        const wrapper = mount(OperationalMap)

        expect(wrapper.text())
            .toContain('SECTOR NORTH')

        expect(wrapper.text())
            .toContain('SECTOR EAST')

        expect(wrapper.text())
            .toContain('SECTOR SOUTH')

        expect(wrapper.text())
            .toContain('SECTOR WEST')

    })


    // =====================================================
    // TEST 4
    // Comprueba que se crea el mapa
    // =====================================================

    test('should initialize the map', async () => {


        // attachTo hace que el componente se monte
        // realmente dentro de document.body
        //
        // Esto permite que:
        //
        // document.getElementById()
        //
        // encuentre #operational-map

        const wrapper =
            mount(OperationalMap, {

                attachTo: document.body

            })


        // Esperamos a que termine onMounted()
        await new Promise(resolve =>
            setTimeout(resolve, 0)
        )


        // Comprobamos que setView()
        // ha recibido la posición inicial
        expect(setView)
            .toHaveBeenCalledWith(

                [40.4168, -3.7038],

                10

            )


        // Limpiamos el componente
        wrapper.unmount()

    })


    // =====================================================
    // TEST 5
    // Comprueba que el mapa se centra
    // en las locations
    // =====================================================

    test('should fit the map to the provided locations', async () => {


        const locations = [

            {

                id: 1,

                name: 'Sector North',

                lat: 40.4268,

                lng: -3.7038,

                status: 'OPERATIONAL'

            },

            {

                id: 2,

                name: 'Sector East',

                lat: 40.4168,

                lng: -3.6838,

                status: 'WARNING'

            }

        ]


        // Montamos el componente dentro
        // de document.body

        const wrapper =
            mount(OperationalMap, {

                props: {

                    locations

                },

                attachTo: document.body

            })


        // Esperamos a que termine onMounted()
        await new Promise(resolve =>
            setTimeout(resolve, 0)
        )


        // Comprobamos que fitBounds()
        // ha sido llamado

        expect(fitBounds)
            .toHaveBeenCalled()


        // Limpiamos el componente

        wrapper.unmount()

    })


})