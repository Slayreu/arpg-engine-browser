import { Player } from '../entities/Player';

export class UI {
    private elements: { [key: string]: HTMLElement } = {};

    constructor() {
        this.initializeElements();
        this.initializeInventoryGrid();
    }

    private initializeElements(): void {
        // Cache references to UI elements
        this.elements.healthFill = document.getElementById('healthFill')!;
        this.elements.healthText = document.getElementById('healthText')!;
        this.elements.manaFill = document.getElementById('manaFill')!;
        this.elements.manaText = document.getElementById('manaText')!;
        this.elements.playerLevel = document.getElementById('playerLevel')!;
        this.elements.playerHP = document.getElementById('playerHP')!;
        this.elements.playerMaxHP = document.getElementById('playerMaxHP')!;
        this.elements.playerMP = document.getElementById('playerMP')!;
        this.elements.playerMaxMP = document.getElementById('playerMaxMP')!;
        this.elements.playerXP = document.getElementById('playerXP')!;
        this.elements.playerPos = document.getElementById('playerPos')!;
        this.elements.inventoryGrid = document.getElementById('inventoryGrid')!;
    }

    private initializeInventoryGrid(): void {
        // Create 8x6 inventory grid (48 slots)
        for (let i = 0; i < 48; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.setAttribute('data-slot', i.toString());
            this.elements.inventoryGrid.appendChild(slot);
        }
    }

    public update(player: Player): void {
        // Update health orb
        const healthPercentage = player.getHealthPercentage();
        this.elements.healthFill.style.height = `${healthPercentage}%`;
        this.elements.healthText.textContent = player.getHealth().toString();

        // Update mana orb
        const manaPercentage = player.getManaPercentage();
        this.elements.manaFill.style.height = `${manaPercentage}%`;
        this.elements.manaText.textContent = player.getMana().toString();

        // Update stats
        this.elements.playerLevel.textContent = player.getLevel().toString();
        this.elements.playerHP.textContent = player.getHealth().toString();
        this.elements.playerMaxHP.textContent = player.getMaxHealth().toString();
        this.elements.playerMP.textContent = player.getMana().toString();
        this.elements.playerMaxMP.textContent = player.getMaxMana().toString();
        this.elements.playerXP.textContent = player.getExperience().toString();

        // Update position (rounded to 1 decimal place)
        const pos = player.getPosition();
        this.elements.playerPos.textContent = `${pos.x.toFixed(1)}, ${pos.z.toFixed(1)}`;

        // Update health orb fill color based on health percentage
        if (healthPercentage > 60) {
            this.elements.healthFill.style.background = 'linear-gradient(0deg, #32CD32, #90EE90)';
        } else if (healthPercentage > 30) {
            this.elements.healthFill.style.background = 'linear-gradient(0deg, #FFD700, #FFA500)';
        } else {
            this.elements.healthFill.style.background = 'linear-gradient(0deg, #FF0000, #FF6600)';
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