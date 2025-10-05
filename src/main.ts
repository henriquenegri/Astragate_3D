import './style.css'
import * as THREE from 'three'
import { DeviceOrientationController } from './controllers/DeviceOrientationController'

class App {
  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private renderer!: THREE.WebGLRenderer
  private deviceOrientationController!: DeviceOrientationController

  constructor() {
    this.initScene()
    this.initCamera()
    this.initRenderer()
    this.createEnvironment()
    this.initControllers()
    this.showStartScreen()
    this.animate()
    
    window.addEventListener('resize', () => this.onWindowResize())
  }

  private initScene(): void {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x000000)
    
    this.loadGLTFModel('/mobile.glb', new THREE.Vector3(0, 0, 0), 1)
  }

  private async loadGLTFModel(modelPath: string, position: THREE.Vector3, scale: number = 1): Promise<void> {
    try {
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
      const loader = new GLTFLoader()
      
      loader.load(
        modelPath,
        (gltf) => {
          const model = gltf.scene
          model.position.copy(position)
          model.scale.setScalar(scale)
          
          const box = new THREE.Box3().setFromObject(model)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          
          model.position.x -= center.x
          model.position.y -= center.y
          model.position.z -= center.z

          // infos => (position: THREE.Vector3, rotation: THREE.Euler, scale: THREE.Vector3)
          this.camera.position.set(1, size.y - 130 , 66)

          // infos => (position: THREE.Vector3, rotation: THREE.Euler, scale: THREE.Vector3)
          this.camera.rotation.set(0, Math.PI, 0)
          this.camera.scale.set(1, 1, 1)

          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true
              child.receiveShadow = true
            }
          })
          
          this.scene.add(model)
        },
        undefined,
        (error) => {
          console.error('Erro ao carregar modelo:', error)
        }
      )
    } catch (error) {
      console.error('Erro ao importar GLTFLoader:', error)
    }
  }

  private initCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      80,
      window.innerWidth / window.innerHeight,
      0.3,
      1100
    )
    this.camera.position.set(0, 1.6, 0)
  }

  private initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    
    const container = document.querySelector<HTMLDivElement>('#app')!
    container.appendChild(this.renderer.domElement)
  }

  private createEnvironment(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    this.scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 10, 5)
    directionalLight.castShadow = true
    this.scene.add(directionalLight)

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5)
    fillLight.position.set(-5, 5, -5)
    this.scene.add(fillLight)
  }

  private initControllers(): void {
    this.deviceOrientationController = new DeviceOrientationController(this.camera)
  }

  private showStartScreen(): void {
    const startScreen = document.createElement('div')
    startScreen.id = 'start-screen'
    startScreen.className = 'start-screen'
    startScreen.innerHTML = `
      <div class="start-content">
        <h1 class="start-title">ASTRAGATE</h1>
        <p class="start-subtitle">3D immersive experience</p>
        <button class="start-button" id="start-btn">
          <span>START</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    `
    document.body.appendChild(startScreen)

    const startBtn = document.getElementById('start-btn')!
    startBtn.addEventListener('click', async () => {
      const enabled = await this.deviceOrientationController.toggle()
      
      if (enabled) {
        startScreen.classList.add('fade-out')
        setTimeout(() => {
          startScreen.remove()
          this.showExitButton()
        }, 500)
      }
    })
  }

  private showExitButton(): void {
    const exitBtn = document.createElement('button')
    exitBtn.id = 'exit-btn'
    exitBtn.className = 'exit-button'
    exitBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>EXIT</span>
    `
    document.body.appendChild(exitBtn)

    exitBtn.addEventListener('click', () => {
      this.deviceOrientationController.disable()
      exitBtn.classList.add('fade-out')
      setTimeout(() => {
        exitBtn.remove()
        this.showStartScreen()
      }, 300)
    })
  }

  private animate = (): void => {
    this.renderer.setAnimationLoop(() => {
      this.deviceOrientationController.update()
      this.renderer.render(this.scene, this.camera)
    })
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

new App()
