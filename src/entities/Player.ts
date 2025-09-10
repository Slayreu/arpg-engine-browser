import * as THREE from 'three';

export class Player {
    private mesh?: THREE.Group;
    private position: THREE.Vector3;
    private targetPosition: THREE.Vector3;
    private isMoving: boolean = false;
    private moveSpeed: number = 3.0;
    
    // Player stats
    private level: number = 1;
    private health: number = 100;
    private maxHealth: number = 100;
    private experience: number = 0;

    constructor() {
        this.position = new THREE.Vector3(0, 0, 0);
        this.targetPosition = new THREE.Vector3(0, 0, 0);
    }

    public init(scene: THREE.Scene): void {
        this.createPlayerModel();
        if (this.mesh) {
            scene.add(this.mesh);
            this.mesh.position.copy(this.position);
        }
    }

    private createPlayerModel(): void {
        this.mesh = new THREE.Group();

        // Create a simple character representation
        // Body (cylinder)
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1 }); // Royal blue
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.6;
        body.castShadow = true;
        this.mesh.add(body);

        // Head (sphere)
        const headGeometry = new THREE.SphereGeometry(0.25, 8, 6);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFDBAC }); // Skin color
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.45;
        head.castShadow = true;
        this.mesh.add(head);

        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.8, 6);
        const armMaterial = new THREE.MeshLambertMaterial({ color: 0xFFDBAC });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.45, 0.8, 0);
        leftArm.castShadow = true;
        this.mesh.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.45, 0.8, 0);
        rightArm.castShadow = true;
        this.mesh.add(rightArm);

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.12, 0.6, 6);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown pants
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.15, -0.3, 0);
        leftLeg.castShadow = true;
        this.mesh.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.15, -0.3, 0);
        rightLeg.castShadow = true;
        this.mesh.add(rightLeg);

        // Simple weapon (staff)
        const weaponGeometry = new THREE.CylinderGeometry(0.03, 0.03, 2, 6);
        const weaponMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const weapon = new THREE.Mesh(weaponGeometry, weaponMaterial);
        weapon.position.set(0.6, 1.2, 0);
        weapon.rotation.z = Math.PI / 6;
        weapon.castShadow = true;
        this.mesh.add(weapon);

        // Weapon crystal/orb at the top
        const orbGeometry = new THREE.SphereGeometry(0.1, 8, 6);
        const orbMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xFF4500,
            emissive: 0x331100 
        });
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.position.set(0.75, 2.1, 0);
        orb.castShadow = true;
        this.mesh.add(orb);
    }

    public update(deltaTime: number): void {
        if (this.isMoving && this.mesh) {
            // Move towards target position
            const direction = this.targetPosition.clone().sub(this.position);
            const distance = direction.length();

            if (distance < 0.1) {
                // Close enough, stop moving
                this.isMoving = false;
                this.position.copy(this.targetPosition);
            } else {
                // Continue moving
                direction.normalize();
                const moveDistance = this.moveSpeed * deltaTime;
                
                if (moveDistance >= distance) {
                    this.position.copy(this.targetPosition);
                    this.isMoving = false;
                } else {
                    this.position.add(direction.multiplyScalar(moveDistance));
                }

                // Rotate to face movement direction
                if (direction.length() > 0) {
                    const angle = Math.atan2(direction.x, direction.z);
                    this.mesh.rotation.y = angle;
                }
            }

            this.mesh.position.copy(this.position);
        }
    }

    public moveTo(targetPosition: THREE.Vector3): void {
        this.targetPosition.copy(targetPosition);
        this.targetPosition.y = 0; // Keep player on ground level
        this.isMoving = true;
    }

    public getPosition(): THREE.Vector3 {
        return this.position.clone();
    }

    public getMesh(): THREE.Group | undefined {
        return this.mesh;
    }

    // Getters for player stats
    public getLevel(): number {
        return this.level;
    }

    public getHealth(): number {
        return this.health;
    }

    public getMaxHealth(): number {
        return this.maxHealth;
    }

    public getExperience(): number {
        return this.experience;
    }

    public getHealthPercentage(): number {
        return (this.health / this.maxHealth) * 100;
    }

    // Methods for gameplay
    public takeDamage(damage: number): void {
        this.health = Math.max(0, this.health - damage);
    }

    public heal(amount: number): void {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    public gainExperience(amount: number): void {
        this.experience += amount;
        
        // Simple level-up mechanism
        const expNeededForNextLevel = this.level * 100;
        if (this.experience >= expNeededForNextLevel) {
            this.levelUp();
        }
    }

    private levelUp(): void {
        this.level++;
        this.experience = 0;
        this.maxHealth += 20;
        this.health = this.maxHealth; // Full heal on level up
        console.log(`Level up! Now level ${this.level}`);
    }
}