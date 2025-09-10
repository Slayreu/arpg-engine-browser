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
    private mana: number = 50;
    private maxMana: number = 50;
    private experience: number = 0;
    private expToNextLevel: number = 100;
    private playerClass: string = 'Sorcerer';

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

        // Create a more detailed Diablo-style character
        // Main body (torso armor)
        const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.5, 1.4, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2a2a3a, // Dark armor color
            emissive: 0x111111
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.7;
        body.castShadow = true;
        this.mesh.add(body);

        // Armor chest piece
        const chestGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.3);
        const chestMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a4a5a,
            emissive: 0x0a0a0a
        });
        const chest = new THREE.Mesh(chestGeometry, chestMaterial);
        chest.position.y = 0.9;
        chest.position.z = 0.15;
        chest.castShadow = true;
        this.mesh.add(chest);

        // Head with hood
        const headGeometry = new THREE.SphereGeometry(0.28, 8, 6);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFDBAC }); // Skin color
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.55;
        head.castShadow = true;
        this.mesh.add(head);

        // Hood/helmet
        const hoodGeometry = new THREE.SphereGeometry(0.32, 8, 6);
        const hoodMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x1a1a2a,
            transparent: true,
            opacity: 0.8
        });
        const hood = new THREE.Mesh(hoodGeometry, hoodMaterial);
        hood.position.y = 1.6;
        hood.scale.y = 0.8;
        hood.castShadow = true;
        this.mesh.add(hood);

        // Arms with armor
        const armGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.9, 6);
        const armMaterial = new THREE.MeshLambertMaterial({ color: 0x3a3a4a });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.55, 0.9, 0);
        leftArm.rotation.z = 0.2;
        leftArm.castShadow = true;
        this.mesh.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.55, 0.9, 0);
        rightArm.rotation.z = -0.2;
        rightArm.castShadow = true;
        this.mesh.add(rightArm);

        // Legs with armor
        const legGeometry = new THREE.CylinderGeometry(0.15, 0.18, 0.8, 6);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x2a2a3a });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.18, -0.2, 0);
        leftLeg.castShadow = true;
        this.mesh.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.18, -0.2, 0);
        rightLeg.castShadow = true;
        this.mesh.add(rightLeg);

        // Magical staff (more elaborate)
        const staffGeometry = new THREE.CylinderGeometry(0.04, 0.04, 2.5, 8);
        const staffMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a2c1a, // Brown wood
            emissive: 0x0a0a00
        });
        const staff = new THREE.Mesh(staffGeometry, staffMaterial);
        staff.position.set(0.7, 1.4, 0);
        staff.rotation.z = Math.PI / 8;
        staff.castShadow = true;
        this.mesh.add(staff);

        // Staff crystal/orb (larger and more magical)
        const orbGeometry = new THREE.SphereGeometry(0.15, 12, 8);
        const orbMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xff6b35,
            emissive: 0x442200,
            transparent: true,
            opacity: 0.8
        });
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.position.set(0.9, 2.6, 0);
        orb.castShadow = true;
        this.mesh.add(orb);

        // Add magical glow around orb
        const glowGeometry = new THREE.SphereGeometry(0.2, 8, 6);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6b35,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(0.9, 2.6, 0);
        this.mesh.add(glow);

        // Add shoulder pads
        const shoulderGeometry = new THREE.SphereGeometry(0.2, 6, 4);
        const shoulderMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x5a5a6a,
            emissive: 0x0a0a0a
        });
        
        const leftShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        leftShoulder.position.set(-0.45, 1.2, 0);
        leftShoulder.scale.set(1, 0.6, 1);
        leftShoulder.castShadow = true;
        this.mesh.add(leftShoulder);

        const rightShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        rightShoulder.position.set(0.45, 1.2, 0);
        rightShoulder.scale.set(1, 0.6, 1);
        rightShoulder.castShadow = true;
        this.mesh.add(rightShoulder);

        // Add cape
        const capeGeometry = new THREE.CylinderGeometry(0.1, 0.6, 1.2, 6, 1, true);
        const capeMaterial = new THREE.MeshLambertMaterial({
            color: 0x1a1a2a,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        const cape = new THREE.Mesh(capeGeometry, capeMaterial);
        cape.position.set(0, 0.8, -0.3);
        cape.rotation.x = 0.1;
        cape.castShadow = true;
        this.mesh.add(cape);
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

        // Regenerate mana over time
        this.regenerateMana(deltaTime);
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

    public getMana(): number {
        return this.mana;
    }

    public getMaxMana(): number {
        return this.maxMana;
    }

    public getExperience(): number {
        return this.experience;
    }

    public getPlayerClass(): string {
        return this.playerClass;
    }

    public getHealthPercentage(): number {
        return (this.health / this.maxHealth) * 100;
    }

    public getManaPercentage(): number {
        return (this.mana / this.maxMana) * 100;
    }

    public getExperiencePercentage(): number {
        return (this.experience / this.expToNextLevel) * 100;
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
        if (this.experience >= this.expToNextLevel) {
            this.levelUp();
        }
    }

    private levelUp(): void {
        this.level++;
        this.experience = 0;
        this.expToNextLevel = this.level * 100; // Increase exp requirement
        this.maxHealth += 20;
        this.maxMana += 10;
        this.health = this.maxHealth; // Full heal on level up
        this.mana = this.maxMana; // Full mana on level up
        console.log(`Level up! Now level ${this.level}`);
    }

    // Mana management methods
    public useMana(amount: number): boolean {
        if (this.mana >= amount) {
            this.mana = Math.max(0, this.mana - amount);
            return true;
        }
        return false;
    }

    public restoreMana(amount: number): void {
        this.mana = Math.min(this.maxMana, this.mana + amount);
    }

    public regenerateMana(deltaTime: number): void {
        // Slow mana regeneration over time
        const regenRate = 5; // mana per second
        this.mana = Math.min(this.maxMana, this.mana + (regenRate * deltaTime));
    }
}