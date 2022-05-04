import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
import * as dat from 'lil-gui'
const cursor = {
    x: 0,
    y: 0
}

//Cursor
window.addEventListener('mousemove', (event) => {
        cursor.x = -(event.clientX / window.innerWidth - .5) * Math.PI * 12;
        cursor.y = -(event.clientY / window.innerHeight - .5) * 2;
    })
    /**
     * Base
     */
    // Debug
const gui = new dat.GUI()

const axisHelper = new THREE.AxisHelper(10)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.add(axisHelper)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
ambientLight.color = new THREE.Color(0xffffff)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('red', .8)
directionalLight.position.x = 2
directionalLight.position.y = 2
directionalLight.position.z = 4
    //scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight('blue', 'yellow', .5)
scene.add(hemisphereLight)

const spotLight = new THREE.SpotLight('blue', 50, 10, Math.PI * 0.1, 1, 1)
spotLight.position.set(cursor.x, cursor.y, 3)

scene.add(spotLight)

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2)
scene.add(spotLightHelper)

window.requestAnimationFrame(() => {
    spotLightHelper.update()
})



/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = -1.5
spotLight.target.position.x = sphere.position.x


const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    spotLight.position.set(cursor.x, cursor.y, 3)


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()