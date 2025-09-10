import * as THREE from 'three';

export class Enemy {
    private mesh?: THREE.Group;
    private position: THREE.Vector3;
    private health: number;
    private maxHealth: number;
    private isAlive: boolean = true;
    
    constructor(position: THREE.Vector3) {
        this.position = position.clone();
        this.health = 80;
        this.maxHealth = 80;
    }

    public init(scene: THREE.Scene): void {
        this.createEnemyModel();
        if (this.mesh) {
            scene.add(this.mesh);
            this.mesh.position.copy(this.position);
        }
    }

    private createEnemyModel(): void {
        this.mesh = new THREE.Group();

        // Create a demonic creature
        // Main body (more angular and menacing)
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 6);
        const bodyMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a1a1a,
            emissive: 0x220000
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.6;
        body.castShadow = true;
        this.mesh.add(body);

        // Head (more skull-like)
        const headGeometry = new THREE.SphereGeometry(0.22, 6, 4);
        const headMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x3a1a1a,
            emissive: 0x110000
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.3;
        head.scale.y = 0.8;
        head.castShadow = true;
        this.mesh.add(head);

        // Glowing red eyes
        const eyeGeometry = new THREE.SphereGeometry(0.03, 4, 3);
        const eyeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff0000
        });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.08, 1.35, 0.15);
        this.mesh.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.08, 1.35, 0.15);
        this.mesh.add(rightEye);

        // Arms (clawed)
        const armGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.8, 6);
        const armMaterial = new THREE.MeshLambertMaterial({ color: 0x3a2a2a });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.4, 0.7, 0);
        leftArm.rotation.z = 0.3;
        leftArm.castShadow = true;
        this.mesh.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.4, 0.7, 0);
        rightArm.rotation.z = -0.3;
        rightArm.castShadow = true;
        this.mesh.add(rightArm);

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.14, 0.7, 6);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x2a1a1a });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.15, -0.15, 0);
        leftLeg.castShadow = true;
        this.mesh.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.15, -0.15, 0);
        rightLeg.castShadow = true;
        this.mesh.add(rightLeg);

        // Add a simple weapon (dark blade)
        const weaponGeometry = new THREE.BoxGeometry(0.05, 1.5, 0.15);
        const weaponMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x1a1a1a,
            emissive: 0x0a0000
        });
        const weapon = new THREE.Mesh(weaponGeometry, weaponMaterial);
        weapon.position.set(0.5, 1.2, 0);
        weapon.rotation.z = Math.PI / 4;
        weapon.castShadow = true;
        this.mesh.add(weapon);

        // Add a small aura effect
        const auraGeometry = new THREE.RingGeometry(0.8, 1.2, 8);
        const auraMaterial = new THREE.MeshBasicMaterial({
            color: 0x440000,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const aura = new THREE.Mesh(auraGeometry, auraMaterial);
        aura.rotation.x = -Math.PI / 2;
        aura.position.y = 0.1;
        this.mesh.add(aura);
    }

    public update(deltaTime: number): void {
        if (!this.isAlive || !this.mesh) return;

        // Simple idle animation - slight bobbing
        const time = Date.now() * 0.002;
        this.mesh.position.y = Math.sin(time) * 0.1;
        
        // Rotate slightly
        this.mesh.rotation.y += deltaTime * 0.5;
    }

    public takeDamage(amount: number): void {
        if (!this.isAlive) return;
        
        this.health = Math.max(0, this.health - amount);
        
        if (this.health <= 0) {
            this.die();
        }
    }

    public heal(amount: number): void {
        if (!this.isAlive) return;
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    private die(): void {
        this.isAlive = false;
        
        if (this.mesh) {
            // Death animation - fade out and fall
            const fadeOut = () => {
                if (!this.mesh) return;
                
                this.mesh.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        const material = child.material as THREE.MeshLambertMaterial;
                        if (material.transparent === undefined) {
                            material.transparent = true;
                        }
                        material.opacity *= 0.95;
                    }
                });
                
                this.mesh.rotation.z += 0.02;
                this.mesh.position.y -= 0.01;
                
                if (this.mesh.position.y > -2) {
                    requestAnimationFrame(fadeOut);
                }
            };
            
            fadeOut();
        }
    }

    public getPosition(): THREE.Vector3 {
        return this.position.clone();
    }

    public getHealth(): number {
        return this.health;
    }

    public getMaxHealth(): number {
        return this.maxHealth;
    }

    public isEnemyAlive(): boolean {
        return this.isAlive;
    }

    public getMesh(): THREE.Group | undefined {
        return this.mesh;
    }
}