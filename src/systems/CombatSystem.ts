import * as THREE from 'three';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';

export class CombatSystem {
    private enemies: Enemy[] = [];
    private scene?: THREE.Scene;

    public init(scene: THREE.Scene): void {
        this.scene = scene;
        this.spawnEnemies();
    }

    private spawnEnemies(): void {
        if (!this.scene) return;

        // Spawn a few enemies around the world
        const enemyPositions = [
            new THREE.Vector3(5, 0, 5),
            new THREE.Vector3(-8, 0, 3),
            new THREE.Vector3(10, 0, -7),
            new THREE.Vector3(-5, 0, -10),
            new THREE.Vector3(0, 0, 8)
        ];

        for (const pos of enemyPositions) {
            const enemy = new Enemy(pos);
            enemy.init(this.scene);
            this.enemies.push(enemy);
        }

        console.log(`Spawned ${this.enemies.length} enemies`);
    }

    public update(deltaTime: number, player: Player): void {
        // Update all enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            if (enemy.isEnemyAlive()) {
                enemy.update(deltaTime, player);
            } else {
                // Remove dead enemies
                this.enemies.splice(i, 1);
                
                // Give player experience for killing enemy
                player.gainExperience(25);
            }
        }

        // Check for player attacks on enemies
        this.handlePlayerAttacks(player);
    }

    private handlePlayerAttacks(player: Player): void {
        // Simple auto-attack when player is near enemies
        const playerPos = player.getPosition();
        const attackRange = 2.5;

        for (const enemy of this.enemies) {
            if (!enemy.isEnemyAlive()) continue;

            const distance = playerPos.distanceTo(enemy.getPosition());
            if (distance <= attackRange) {
                // Player attacks enemy (simple auto-attack)
                const currentTime = Date.now();
                if (!player.getLastAttackTime || currentTime - player.getLastAttackTime() >= 1500) {
                    enemy.takeDamage(25);
                    player.setLastAttackTime(currentTime);
                    console.log('Player attacks enemy for 25 damage!');
                    
                    // Visual feedback could be added here
                    this.createAttackEffect(playerPos, enemy.getPosition());
                }
            }
        }
    }

    private createAttackEffect(playerPos: THREE.Vector3, enemyPos: THREE.Vector3): void {
        if (!this.scene) return;

        // Create a simple attack effect (lightning bolt)
        const points = [playerPos.clone(), enemyPos.clone()];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
            color: 0xFFFF00,
            transparent: true,
            opacity: 0.8
        });
        
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);

        // Remove effect after short time
        setTimeout(() => {
            if (line.parent) {
                line.parent.remove(line);
            }
        }, 150);
    }

    public getEnemies(): Enemy[] {
        return this.enemies;
    }

    public getEnemyCount(): number {
        return this.enemies.filter(enemy => enemy.isEnemyAlive()).length;
    }

    public spawnEnemy(position: THREE.Vector3): void {
        if (!this.scene) return;

        const enemy = new Enemy(position);
        enemy.init(this.scene);
        this.enemies.push(enemy);
    }
}