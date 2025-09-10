import { Player } from '../entities/Player';

export class UI {
    private elements: { [key: string]: HTMLElement } = {};

    constructor() {
        this.initializeElements();
    }

    private initializeElements(): void {
        // Cache references to UI elements
        this.elements.healthFill = document.getElementById('healthFill')!;
        this.elements.playerLevel = document.getElementById('playerLevel')!;
        this.elements.playerHP = document.getElementById('playerHP')!;
        this.elements.playerMaxHP = document.getElementById('playerMaxHP')!;
        this.elements.playerXP = document.getElementById('playerXP')!;
        this.elements.playerPos = document.getElementById('playerPos')!;
        this.elements.enemyCount = document.getElementById('enemyCount')!;
    }

    public update(player: Player, enemyCount?: number): void {
        // Update health bar
        const healthPercentage = player.getHealthPercentage();
        this.elements.healthFill.style.width = `${healthPercentage}%`;

        // Update stats
        this.elements.playerLevel.textContent = player.getLevel().toString();
        this.elements.playerHP.textContent = player.getHealth().toString();
        this.elements.playerMaxHP.textContent = player.getMaxHealth().toString();
        this.elements.playerXP.textContent = player.getExperience().toString();

        // Update position (rounded to 2 decimal places)
        const pos = player.getPosition();
        this.elements.playerPos.textContent = `${pos.x.toFixed(1)}, ${pos.z.toFixed(1)}`;

        // Update enemy count
        if (enemyCount !== undefined) {
            this.elements.enemyCount.textContent = enemyCount.toString();
        }

        // Update health bar color based on health percentage
        if (healthPercentage > 60) {
            this.elements.healthFill.style.background = 'linear-gradient(90deg, #32CD32, #90EE90)';
        } else if (healthPercentage > 30) {
            this.elements.healthFill.style.background = 'linear-gradient(90deg, #FFD700, #FFA500)';
        } else {
            this.elements.healthFill.style.background = 'linear-gradient(90deg, #FF0000, #FF6600)';
        }
    }

    public showMessage(message: string, duration: number = 3000): void {
        // Create a temporary message element
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            z-index: 1000;
            pointer-events: none;
        `;

        document.body.appendChild(messageElement);

        // Remove after duration
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, duration);
    }

    public updateInventory(items: string[]): void {
        // TODO: Implement inventory system
        // This is a placeholder for future inventory functionality
        console.log('Inventory updated:', items);
    }
}