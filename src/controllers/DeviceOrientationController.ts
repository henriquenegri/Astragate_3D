import * as THREE from 'three'

/**
 * Controlador para Device Orientation API
 * Permite rotacionar a câmera usando o giroscópio do dispositivo móvel
 */
export class DeviceOrientationController {
  private camera: THREE.Camera
  private enabled: boolean = false
  private alphaOffset: number = 0
  private deviceOrientation: DeviceOrientationEvent | null = null
  private screenOrientation: number = 0

  constructor(camera: THREE.Camera) {
    this.camera = camera

    // Listeners para orientation
    window.addEventListener('orientationchange', () => this.onScreenOrientationChange())
    this.onScreenOrientationChange()
  }

  /**
   * Ativa ou desativa o controle por giroscópio
   */
  async toggle(): Promise<boolean> {
    if (this.enabled) {
      this.disable()
      return false
    } else {
      await this.enable()
      return this.enabled
    }
  }

  /**
   * Ativa o controle
   */
  async enable(): Promise<void> {
    // Para iOS 13+ precisamos pedir permissão
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        if (permission !== 'granted') {
          alert('Permissão negada para acessar o giroscópio')
          return
        }
      } catch (error) {
        console.error('Erro ao solicitar permissão:', error)
        alert('Erro ao solicitar permissão para o giroscópio')
        return
      }
    }

    window.addEventListener('deviceorientation', this.onDeviceOrientation, false)
    this.enabled = true
    console.log('Device Orientation habilitado')
  }

  /**
   * Desativa o controle
   */
  disable(): void {
    window.removeEventListener('deviceorientation', this.onDeviceOrientation, false)
    this.enabled = false
    this.deviceOrientation = null
    console.log('Device Orientation desabilitado')
  }

  /**
   * Handler para eventos de orientação do dispositivo
   */
  private onDeviceOrientation = (event: DeviceOrientationEvent): void => {
    this.deviceOrientation = event
  }

  /**
   * Handler para mudanças na orientação da tela
   */
  private onScreenOrientationChange(): void {
    this.screenOrientation = window.orientation || 0
  }

  /**
   * Atualiza a rotação da câmera baseada na orientação do dispositivo
   */
  update(): void {
    if (!this.enabled || !this.deviceOrientation) return

    const alpha = this.deviceOrientation.alpha ? THREE.MathUtils.degToRad(this.deviceOrientation.alpha) + this.alphaOffset : 0
    const beta = this.deviceOrientation.beta ? THREE.MathUtils.degToRad(this.deviceOrientation.beta) : 0
    const gamma = this.deviceOrientation.gamma ? THREE.MathUtils.degToRad(this.deviceOrientation.gamma) : 0
    const orient = this.screenOrientation ? THREE.MathUtils.degToRad(this.screenOrientation) : 0

    this.setObjectQuaternion(alpha, beta, gamma, orient)
  }

  /**
   * Define o quaternion da câmera baseado nos ângulos de Euler
   */
  private setObjectQuaternion(
    alpha: number,
    beta: number,
    gamma: number,
    orient: number
  ): void {
    const zee = new THREE.Vector3(0, 0, 1)
    const euler = new THREE.Euler()
    const q0 = new THREE.Quaternion()
    const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5))

    euler.set(beta, alpha, -gamma, 'YXZ')
    this.camera.quaternion.setFromEuler(euler)
    this.camera.quaternion.multiply(q1)
    this.camera.quaternion.multiply(q0.setFromAxisAngle(zee, -orient))
  }

  /**
   * Retorna se o controle está habilitado
   */
  isEnabled(): boolean {
    return this.enabled
  }
}
