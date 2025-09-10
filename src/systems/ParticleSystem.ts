import * as THREE from 'three';

export interface ParticleOptions {
    position: THREE.Vector3;
    color: number;
    size: number;
    lifetime: number;
    velocity: THREE.Vector3;
    gravity?: number;
}

export class Particle {
    public mesh: THREE.Mesh;
    public velocity: THREE.Vector3;
    public lifetime: number;
    public maxLifetime: number;
    public gravity: number;

    constructor(options: ParticleOptions) {
        // Create particle geometry and material
        const geometry = new THREE.SphereGeometry(options.size, 8, 6);
        const material = new THREE.MeshBasicMaterial({
            color: options.color,
            transparent: true,
            opacity: 1.0
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(options.position);
        this.velocity = options.velocity.clone();
        this.lifetime = options.lifetime;
        this.maxLifetime = options.lifetime;
        this.gravity = options.gravity || 0;
    }

    public update(deltaTime: number): boolean {
        // Update position
        this.mesh.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        
        // Apply gravity
        if (this.gravity !== 0) {
            this.velocity.y -= this.gravity * deltaTime;
        }

        // Update lifetime
        this.lifetime -= deltaTime;
        
        // Fade out as lifetime decreases
        const material = this.mesh.material as THREE.MeshBasicMaterial;
        material.opacity = this.lifetime / this.maxLifetime;

        // Return false when particle should be removed
        return this.lifetime > 0;
    }

    public dispose(): void {
        this.mesh.geometry.dispose();
        (this.mesh.material as THREE.Material).dispose();
    }
}

export class ParticleSystem {
    private scene: THREE.Scene;
    private particles: Particle[] = [];

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    public createExplosion(position: THREE.Vector3, color: number = 0xff6600, count: number = 20): void {
        for (let i = 0; i < count; i++) {
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                Math.random() * 8 + 2,
                (Math.random() - 0.5) * 10
            );

            const particle = new Particle({
                position: position.clone(),
                color: color,
                size: 0.1 + Math.random() * 0.1,
                lifetime: 1 + Math.random() * 2,
                velocity: velocity,
                gravity: 5
            });

            this.particles.push(particle);
            this.scene.add(particle.mesh);
        }
    }

    public createMagicAura(position: THREE.Vector3, color: number = 0x4dabf7, count: number = 10): void {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const radius = 1 + Math.random() * 0.5;
            
            const velocity = new THREE.Vector3(
                Math.cos(angle) * 2,
                Math.random() * 3 + 1,
                Math.sin(angle) * 2
            );

            const particlePos = new THREE.Vector3(
                position.x + Math.cos(angle) * radius,
                position.y + 0.5,
                position.z + Math.sin(angle) * radius
            );

            const particle = new Particle({
                position: particlePos,
                color: color,
                size: 0.05 + Math.random() * 0.05,
                lifetime: 2 + Math.random() * 1,
                velocity: velocity,
                gravity: -1 // Negative gravity for upward float
            });

            this.particles.push(particle);
            this.scene.add(particle.mesh);
        }
    }

    public createHealingEffect(position: THREE.Vector3): void {
        this.createMagicAura(position, 0x51cf66, 15);
    }

    public createFireball(position: THREE.Vector3): void {
        this.createExplosion(position, 0xff4444, 25);
    }

    public createLightning(position: THREE.Vector3): void {
        // Create a quick burst of yellow/white particles
        for (let i = 0; i < 15; i++) {
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 15,
                Math.random() * 10,
                (Math.random() - 0.5) * 15
            );

            const particle = new Particle({
                position: position.clone(),
                color: 0xffd43b,
                size: 0.08 + Math.random() * 0.04,
                lifetime: 0.3 + Math.random() * 0.5,
                velocity: velocity,
                gravity: 0
            });

            this.particles.push(particle);
            this.scene.add(particle.mesh);
        }
    }

    public update(deltaTime: number): void {
        // Update all particles
        this.particles = this.particles.filter(particle => {
            const alive = particle.update(deltaTime);
            
            if (!alive) {
                // Remove from scene and dispose
                this.scene.remove(particle.mesh);
                particle.dispose();
            }
            
            return alive;
        });
    }

    public dispose(): void {
        // Clean up all particles
        this.particles.forEach(particle => {
            this.scene.remove(particle.mesh);
            particle.dispose();
        });
        this.particles = [];
    }
}