import * as THREE from 'three';
import { Player } from './Player';

export class Enemy {
    private mesh?: THREE.Group;
    private position: THREE.Vector3;
    private health: number = 50;
    private maxHealth: number = 50;
    private attackDamage: number = 10;
    private detectionRange: number = 5;
    private attackRange: number = 2;
    private moveSpeed: number = 1.5;
    private isAlive: boolean = true;
    private targetPosition: THREE.Vector3;
    private isMoving: boolean = false;
    private lastAttackTime: number = 0;
    private attackCooldown: number = 2000; // 2 seconds

    constructor(position: THREE.Vector3) {
        this.position = position.clone();
        this.targetPosition = position.clone();
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

        // Body (more aggressive looking)
        const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.35, 1, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000 }); // Dark red
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        body.castShadow = true;
        this.mesh.add(body);

        // Head (more menacing)
        const headGeometry = new THREE.SphereGeometry(0.2, 8, 6);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.2;
        head.castShadow = true;
        this.mesh.add(head);

        // Eyes (glowing)
        const eyeGeometry = new THREE.SphereGeometry(0.03, 4, 3);
        const eyeMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xFF0000,
            emissive: 0x440000 
        });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.08, 1.25, 0.15);
        this.mesh.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.08, 1.25, 0.15);
        this.mesh.add(rightEye);

        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.06, 0.08, 0.7, 6);
        const armMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.35, 0.7, 0);
        leftArm.castShadow = true;
        this.mesh.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.35, 0.7, 0);
        rightArm.castShadow = true;
        this.mesh.add(rightArm);

        // Health bar above enemy
        this.createHealthBar();
    }

    private createHealthBar(): void {
        if (!this.mesh) return;

        const barWidth = 0.8;
        const barHeight = 0.1;
        
        // Background
        const bgGeometry = new THREE.PlaneGeometry(barWidth, barHeight);
        const bgMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const background = new THREE.Mesh(bgGeometry, bgMaterial);
        background.position.set(0, 2, 0);
        background.lookAt(0, 2, 1); // Face camera
        this.mesh.add(background);

        // Health fill
        const fillGeometry = new THREE.PlaneGeometry(barWidth * 0.98, barHeight * 0.8);
        const fillMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        const healthFill = new THREE.Mesh(fillGeometry, fillMaterial);
        healthFill.position.set(0, 2, 0.01);
        healthFill.lookAt(0, 2, 1);
        healthFill.name = 'healthFill';
        this.mesh.add(healthFill);
    }

    public update(deltaTime: number, player: Player): void {
        if (!this.isAlive || !this.mesh) return;

        const playerPos = player.getPosition();
        const distanceToPlayer = this.position.distanceTo(playerPos);

        // AI behavior
        if (distanceToPlayer <= this.attackRange) {
            // Attack player
            this.attackPlayer(player);
        } else if (distanceToPlayer <= this.detectionRange) {
            // Chase player
            this.chasePlayer(playerPos);
        }

        // Update movement
        if (this.isMoving) {
            const direction = this.targetPosition.clone().sub(this.position);
            const distance = direction.length();

            if (distance < 0.1) {
                this.isMoving = false;
            } else {
                direction.normalize();
                const moveDistance = this.moveSpeed * deltaTime;
                
                if (moveDistance >= distance) {
                    this.position.copy(this.targetPosition);
                    this.isMoving = false;
                } else {
                    this.position.add(direction.multiplyScalar(moveDistance));
                }

                // Rotate to face movement direction
                const angle = Math.atan2(direction.x, direction.z);
                this.mesh.rotation.y = angle;
            }

            this.mesh.position.copy(this.position);
        }

        // Update health bar
        this.updateHealthBar();
    }

    private chasePlayer(playerPos: THREE.Vector3): void {
        this.targetPosition.copy(playerPos);
        this.isMoving = true;
    }

    private attackPlayer(player: Player): void {
        const currentTime = Date.now();
        if (currentTime - this.lastAttackTime >= this.attackCooldown) {
            player.takeDamage(this.attackDamage);
            this.lastAttackTime = currentTime;
            console.log(`Enemy attacks for ${this.attackDamage} damage!`);
        }
    }

    private updateHealthBar(): void {
        if (!this.mesh) return;

        const healthFill = this.mesh.getObjectByName('healthFill') as THREE.Mesh;
        if (healthFill) {
            const healthPercent = this.health / this.maxHealth;
            healthFill.scale.x = healthPercent;
            
            // Change color based on health
            const material = healthFill.material as THREE.MeshBasicMaterial;
            if (healthPercent > 0.6) {
                material.color.setHex(0x00FF00);
            } else if (healthPercent > 0.3) {
                material.color.setHex(0xFFFF00);
            } else {
                material.color.setHex(0xFF0000);
            }
        }
    }

    public takeDamage(damage: number): void {
        this.health = Math.max(0, this.health - damage);
        if (this.health <= 0) {
            this.die();
        }
    }

    private die(): void {
        this.isAlive = false;
        if (this.mesh && this.mesh.parent) {
            this.mesh.parent.remove(this.mesh);
        }
        console.log('Enemy defeated!');
    }

    public getPosition(): THREE.Vector3 {
        return this.position.clone();
    }

    public getMesh(): THREE.Group | undefined {
        return this.mesh;
    }

    public isEnemyAlive(): boolean {
        return this.isAlive;
    }

    public getHealth(): number {
        return this.health;
    }

    public getMaxHealth(): number {
        return this.maxHealth;
    }
}