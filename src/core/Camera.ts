import * as THREE from 'three';

export class Camera {
    private camera: THREE.PerspectiveCamera;
    private position: THREE.Vector3;

    constructor() {
        this.camera = new THREE.PerspectiveCamera(
            45, // Field of view
            window.innerWidth / window.innerHeight, // Aspect ratio
            0.1, // Near clipping plane
            1000 // Far clipping plane
        );
        
        this.position = new THREE.Vector3(10, 10, 10);
        this.camera.position.copy(this.position);
    }

    public getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    public setIsometricView(): void {
        // Set up isometric-like view typical for ARPG games
        const distance = 15;
        const angle = Math.PI / 6; // 30 degrees
        
        this.position.set(
            distance * Math.cos(angle),
            distance * 0.7,
            distance * Math.sin(angle)
        );
        
        this.camera.position.copy(this.position);
        this.camera.lookAt(0, 0, 0);
    }

    public lookAt(target: THREE.Vector3): void {
        this.camera.lookAt(target);
    }

    public updateAspectRatio(aspectRatio: number): void {
        this.camera.aspect = aspectRatio;
        this.camera.updateProjectionMatrix();
    }

    public moveForward(distance: number): void {
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.camera.quaternion);
        direction.normalize();
        
        this.position.add(direction.multiplyScalar(distance));
        this.camera.position.copy(this.position);
    }

    public moveBackward(distance: number): void {
        this.moveForward(-distance);
    }

    public moveLeft(distance: number): void {
        const direction = new THREE.Vector3(-1, 0, 0);
        direction.applyQuaternion(this.camera.quaternion);
        direction.normalize();
        
        this.position.add(direction.multiplyScalar(distance));
        this.camera.position.copy(this.position);
    }

    public moveRight(distance: number): void {
        this.moveLeft(-distance);
    }

    public getPosition(): THREE.Vector3 {
        return this.position.clone();
    }
}