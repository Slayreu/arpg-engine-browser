import * as THREE from 'three';

export interface DamageNumber {
    mesh: THREE.Sprite;
    velocity: THREE.Vector3;
    lifetime: number;
    maxLifetime: number;
}

export class CombatSystem {
    private scene: THREE.Scene;
    private damageNumbers: DamageNumber[] = [];

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    public showDamageNumber(
        position: THREE.Vector3, 
        damage: number, 
        type: 'damage' | 'heal' | 'mana' | 'critical' = 'damage'
    ): void {
        // Create text geometry for damage number
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        
        // Set canvas size
        canvas.width = 256;
        canvas.height = 128;
        
        // Configure text appearance based on type
        let color: string;
        let fontSize: number = 48;
        let text: string;
        
        switch (type) {
            case 'damage':
                color = '#ff4444';
                text = `-${damage}`;
                break;
            case 'critical':
                color = '#ffff00';
                fontSize = 64;
                text = `-${damage}!`;
                break;
            case 'heal':
                color = '#44ff44';
                text = `+${damage}`;
                break;
            case 'mana':
                color = '#4444ff';
                text = `+${damage}`;
                break;
        }
        
        // Draw text on canvas
        context.font = `bold ${fontSize}px Arial`;
        context.fillStyle = color;
        context.strokeStyle = '#000000';
        context.lineWidth = 3;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Add stroke (outline)
        context.strokeText(text, canvas.width / 2, canvas.height / 2);
        // Add fill
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        // Create texture and material
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 1.0
        });
        
        // Create sprite
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(2, 1, 1);
        sprite.position.copy(position);
        sprite.position.y += 2; // Float above the character
        
        // Random horizontal offset for multiple damage numbers
        sprite.position.x += (Math.random() - 0.5) * 2;
        sprite.position.z += (Math.random() - 0.5) * 2;
        
        // Create velocity for upward movement
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 2, // Random horizontal drift
            3 + Math.random() * 2,     // Upward movement
            0
        );
        
        const damageNumber: DamageNumber = {
            mesh: sprite,
            velocity: velocity,
            lifetime: 2.0 + Math.random() * 1.0, // Random lifetime 2-3 seconds
            maxLifetime: 2.0 + Math.random() * 1.0
        };
        
        this.damageNumbers.push(damageNumber);
        this.scene.add(sprite);
    }

    public dealDamage(
        target: { takeDamage: (amount: number) => void, getPosition: () => THREE.Vector3 },
        damage: number,
        isCritical: boolean = false
    ): void {
        // Apply damage to target
        target.takeDamage(damage);
        
        // Show damage number
        const position = target.getPosition();
        this.showDamageNumber(position, damage, isCritical ? 'critical' : 'damage');
    }

    public healTarget(
        target: { heal: (amount: number) => void, getPosition: () => THREE.Vector3 },
        amount: number
    ): void {
        // Apply healing to target
        target.heal(amount);
        
        // Show healing number
        const position = target.getPosition();
        this.showDamageNumber(position, amount, 'heal');
    }

    public restoreMana(
        target: { restoreMana: (amount: number) => void, getPosition: () => THREE.Vector3 },
        amount: number
    ): void {
        // Apply mana restoration to target
        target.restoreMana(amount);
        
        // Show mana number
        const position = target.getPosition();
        this.showDamageNumber(position, amount, 'mana');
    }

    public calculateDamage(baseDamage: number, critChance: number = 0.1): { damage: number, isCritical: boolean } {
        const isCritical = Math.random() < critChance;
        const damage = isCritical ? Math.floor(baseDamage * 1.5) : baseDamage;
        
        return { damage, isCritical };
    }

    public update(deltaTime: number): void {
        // Update damage numbers
        this.damageNumbers = this.damageNumbers.filter(damageNumber => {
            // Update position
            damageNumber.mesh.position.add(
                damageNumber.velocity.clone().multiplyScalar(deltaTime)
            );
            
            // Apply gravity to velocity (slow down upward movement)
            damageNumber.velocity.y -= 9.8 * deltaTime;
            
            // Update lifetime
            damageNumber.lifetime -= deltaTime;
            
            // Fade out
            const material = damageNumber.mesh.material as THREE.SpriteMaterial;
            material.opacity = damageNumber.lifetime / damageNumber.maxLifetime;
            
            // Remove if lifetime expired
            if (damageNumber.lifetime <= 0) {
                this.scene.remove(damageNumber.mesh);
                const material = damageNumber.mesh.material as THREE.SpriteMaterial;
                material.dispose();
                if (material.map) {
                    material.map.dispose();
                }
                return false;
            }
            
            return true;
        });
    }

    public dispose(): void {
        // Clean up all damage numbers
        this.damageNumbers.forEach(damageNumber => {
            this.scene.remove(damageNumber.mesh);
            const material = damageNumber.mesh.material as THREE.SpriteMaterial;
            material.dispose();
            if (material.map) {
                material.map.dispose();
            }
        });
        this.damageNumbers = [];
    }
}