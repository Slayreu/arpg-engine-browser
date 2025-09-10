import { Player } from '../entities/Player';
import { InventorySystem, Item } from '../systems/InventorySystem';
import * as THREE from 'three';

export class UI {
    private elements: { [key: string]: HTMLElement } = {};
    private skillSlots: HTMLElement[] = [];
    private inventoryVisible: boolean = false;
    private player?: Player;
    private inventorySystem: InventorySystem;
    
    // Callback for skill activation
    public onSkillActivated?: (skillName: string, position: THREE.Vector3) => void;

    constructor() {
        this.inventorySystem = new InventorySystem();
        this.initializeElements();
        this.setupEventListeners();
        this.createInventoryGrid();
        this.setupInventorySystem();
    }

    private initializeElements(): void {
        // Cache references to UI elements
        this.elements.playerLevel = document.getElementById('playerLevel')!;
        this.elements.playerClass = document.getElementById('playerClass')!;
        this.elements.playerPos = document.getElementById('playerPos')!;
        this.elements.healthText = document.getElementById('healthText')!;
        this.elements.manaText = document.getElementById('manaText')!;
        this.elements.healthValue = document.getElementById('healthValue')!;
        this.elements.manaValue = document.getElementById('manaValue')!;
        this.elements.expFill = document.getElementById('expFill')!;
        this.elements.healthOrb = document.getElementById('healthOrb')!;
        this.elements.manaOrb = document.getElementById('manaOrb')!;
        this.elements.inventoryPanel = document.getElementById('inventoryPanel')!;
        this.elements.tooltip = document.getElementById('tooltip')!;

        // Cache skill slots
        this.skillSlots = Array.from(document.querySelectorAll('.skill-slot'));
    }

    private setupEventListeners(): void {
        // Skill slot interactions
        this.skillSlots.forEach((slot, index) => {
            const skillKey = slot.getAttribute('data-key');
            const skillName = slot.getAttribute('data-skill');
            
            slot.addEventListener('click', () => {
                this.activateSkill(index, skillName!);
            });

            slot.addEventListener('mouseenter', (event) => {
                this.showSkillTooltip(event, skillName!, skillKey!);
            });

            slot.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });

        // Inventory toggle (I key)
        document.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() === 'i') {
                this.toggleInventory();
            }
            // Handle skill hotkeys
            if (['1', '2', '3', '4', 'q', 'e'].includes(event.key.toLowerCase())) {
                const skillIndex = this.getSkillIndexFromKey(event.key.toLowerCase());
                if (skillIndex !== -1) {
                    this.activateSkill(skillIndex, this.skillSlots[skillIndex].getAttribute('data-skill')!);
                }
            }
        });

        // Orb click effects
        this.elements.healthOrb.addEventListener('click', () => {
            this.showMessage('Health Potion Used!', 1500);
        });

        this.elements.manaOrb.addEventListener('click', () => {
            this.showMessage('Mana Potion Used!', 1500);
        });
    }

    private getSkillIndexFromKey(key: string): number {
        const keyMap: { [key: string]: number } = {
            '1': 0, '2': 1, '3': 2, '4': 3, 'q': 4, 'e': 5
        };
        return keyMap[key] ?? -1;
    }

    private activateSkill(index: number, skillName: string): void {
        if (index < 0 || index >= this.skillSlots.length) return;

        const slot = this.skillSlots[index];
        
        // Visual feedback
        slot.classList.add('active', 'skill-cooldown');
        
        // Remove active class after animation
        setTimeout(() => {
            slot.classList.remove('active', 'skill-cooldown');
        }, 300);

        // Show skill activation message
        this.showMessage(`${this.formatSkillName(skillName)} activated!`, 1200);
        
        // Trigger particle effect callback
        if (this.onSkillActivated && this.player) {
            const playerPos = this.player.getPosition();
            this.onSkillActivated(skillName, playerPos);
        }
        
        console.log(`Skill activated: ${skillName}`);
    }

    private formatSkillName(skillName: string): string {
        return skillName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    private showSkillTooltip(event: MouseEvent, skillName: string, key: string): void {
        const tooltipContent = this.getSkillTooltip(skillName, key);
        
        this.elements.tooltip.innerHTML = tooltipContent;
        this.elements.tooltip.style.display = 'block';
        
        // Position tooltip
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        this.elements.tooltip.style.left = `${rect.left + rect.width / 2}px`;
        this.elements.tooltip.style.top = `${rect.top - 10}px`;
        this.elements.tooltip.style.transform = 'translate(-50%, -100%)';
    }

    private getSkillTooltip(skillName: string, key: string): string {
        const tooltips: { [key: string]: string } = {
            'fireball': `<div style="color: #ff4444; font-weight: bold;">Fireball</div>
                        <div style="color: #d4af37;">Hotkey: ${key.toUpperCase()}</div>
                        <div style="margin-top: 8px; color: #ccc;">
                        Launch a blazing fireball that deals fire damage to enemies.
                        </div>
                        <div style="margin-top: 6px; color: #88f;">
                        Damage: 25-35<br>
                        Mana Cost: 8<br>
                        Cast Time: 0.8s
                        </div>`,
            'icebolt': `<div style="color: #4dabf7; font-weight: bold;">Ice Bolt</div>
                       <div style="color: #d4af37;">Hotkey: ${key.toUpperCase()}</div>
                       <div style="margin-top: 8px; color: #ccc;">
                       Fire a bolt of ice that slows and damages enemies.
                       </div>
                       <div style="margin-top: 6px; color: #88f;">
                       Damage: 18-28<br>
                       Mana Cost: 6<br>
                       Slow: 30%
                       </div>`,
            'lightning': `<div style="color: #ffd43b; font-weight: bold;">Lightning</div>
                         <div style="color: #d4af37;">Hotkey: ${key.toUpperCase()}</div>
                         <div style="margin-top: 8px; color: #ccc;">
                         Strike enemies with chain lightning.
                         </div>
                         <div style="margin-top: 6px; color: #88f;">
                         Damage: 30-45<br>
                         Mana Cost: 12<br>
                         Chain: 3 targets
                         </div>`,
            'teleport': `<div style="color: #e599f7; font-weight: bold;">Teleport</div>
                        <div style="color: #d4af37;">Hotkey: ${key.toUpperCase()}</div>
                        <div style="margin-top: 8px; color: #ccc;">
                        Instantly teleport to target location.
                        </div>
                        <div style="margin-top: 6px; color: #88f;">
                        Range: 15 units<br>
                        Mana Cost: 15<br>
                        Cooldown: 3s
                        </div>`,
            'heal': `<div style="color: #51cf66; font-weight: bold;">Heal</div>
                    <div style="color: #d4af37;">Hotkey: ${key.toUpperCase()}</div>
                    <div style="margin-top: 8px; color: #ccc;">
                    Restore health over time.
                    </div>
                    <div style="margin-top: 6px; color: #88f;">
                    Healing: 50 HP<br>
                    Duration: Instant<br>
                    Cooldown: 5s
                    </div>`,
            'mana-potion': `<div style="color: #4dabf7; font-weight: bold;">Mana Potion</div>
                           <div style="color: #d4af37;">Hotkey: ${key.toUpperCase()}</div>
                           <div style="margin-top: 8px; color: #ccc;">
                           Restore mana instantly.
                           </div>
                           <div style="margin-top: 6px; color: #88f;">
                           Mana: 30 MP<br>
                           Duration: Instant<br>
                           Cooldown: 3s
                           </div>`
        };

        return tooltips[skillName] || `<div>${this.formatSkillName(skillName)}</div>`;
    }

    private hideTooltip(): void {
        this.elements.tooltip.style.display = 'none';
    }

    private toggleInventory(): void {
        this.inventoryVisible = !this.inventoryVisible;
        this.elements.inventoryPanel.style.display = this.inventoryVisible ? 'block' : 'none';
        
        if (this.inventoryVisible) {
            this.showMessage('Inventory opened (Press I to close)', 1500);
        }
    }

    private createInventoryGrid(): void {
        const grid = document.querySelector('.inventory-grid')!;
        
        // Clear existing slots
        grid.innerHTML = '';
        
        // Create 5 rows x 8 columns = 40 slots
        for (let i = 0; i < 40; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.dataset.slotId = i.toString();
            
            // Add drag and drop functionality
            slot.addEventListener('dragover', (event) => {
                event.preventDefault();
                slot.classList.add('drag-over');
            });
            
            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });
            
            slot.addEventListener('drop', (event) => {
                event.preventDefault();
                slot.classList.remove('drag-over');
                this.handleItemDrop(event, parseInt(slot.dataset.slotId!));
            });
            
            slot.addEventListener('mouseenter', (event) => {
                const slotData = this.inventorySystem.getSlot(i);
                if (slotData && slotData.item) {
                    this.showItemTooltip(event, slotData.item, slotData.quantity);
                }
            });
            
            slot.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
            
            grid.appendChild(slot);
        }
        
        this.updateInventoryDisplay();
    }

    private setupInventorySystem(): void {
        // Add some sample items for testing
        const sampleItems = InventorySystem.createSampleItems();
        sampleItems.forEach(item => {
            this.inventorySystem.addItem(item, item.stackSize && item.stackSize > 1 ? 5 : 1);
        });
        
        // Set up callback for inventory changes
        this.inventorySystem.setInventoryChangedCallback(() => {
            this.updateInventoryDisplay();
        });
    }

    private updateInventoryDisplay(): void {
        const slots = this.inventorySystem.getAllSlots();
        const slotElements = document.querySelectorAll('.inventory-slot');
        
        slots.forEach((slotData, index) => {
            const slotElement = slotElements[index] as HTMLElement;
            if (!slotElement) return;
            
            // Clear slot
            slotElement.innerHTML = '';
            slotElement.className = 'inventory-slot';
            
            if (slotData.item) {
                // Add item to slot
                const itemElement = document.createElement('div');
                itemElement.className = 'inventory-item';
                itemElement.draggable = true;
                itemElement.dataset.slotId = index.toString();
                
                // Set item appearance based on rarity
                const rarityColors: { [key: string]: string } = {
                    common: '#9ca3af',
                    magic: '#3b82f6',
                    rare: '#eab308',
                    legendary: '#f97316',
                    unique: '#8b5cf6'
                };
                
                itemElement.style.cssText = `
                    width: 100%;
                    height: 100%;
                    background: ${rarityColors[slotData.item.rarity] || '#9ca3af'};
                    border: 2px solid ${rarityColors[slotData.item.rarity] || '#9ca3af'};
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    font-weight: bold;
                    color: white;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
                    cursor: grab;
                    position: relative;
                `;
                
                // Add item icon or abbreviation
                const iconText = this.getItemIcon(slotData.item);
                itemElement.textContent = iconText;
                
                // Add quantity if stackable
                if (slotData.quantity > 1) {
                    const quantityElement = document.createElement('div');
                    quantityElement.className = 'item-quantity';
                    quantityElement.textContent = slotData.quantity.toString();
                    quantityElement.style.cssText = `
                        position: absolute;
                        bottom: 2px;
                        right: 2px;
                        font-size: 8px;
                        background: rgba(0,0,0,0.7);
                        padding: 1px 3px;
                        border-radius: 2px;
                    `;
                    itemElement.appendChild(quantityElement);
                }
                
                // Add drag start event
                itemElement.addEventListener('dragstart', (event) => {
                    this.handleItemDragStart(event, index);
                });
                
                slotElement.appendChild(itemElement);
            }
        });
    }

    private getItemIcon(item: Item): string {
        const icons: { [key: string]: string } = {
            'sword_001': '⚔️',
            'health_potion': '❤️',
            'mana_potion': '💙',
            'leather_armor': '🛡️',
            'magic_ring': '💍',
            'fire_staff': '🔥'
        };
        
        return icons[item.id] || item.name.substring(0, 2).toUpperCase();
    }

    private handleItemDragStart(event: DragEvent, slotId: number): void {
        if (!event.dataTransfer) return;
        
        event.dataTransfer.setData('text/plain', slotId.toString());
    }

    private handleItemDrop(event: DragEvent, targetSlotId: number): void {
        if (!event.dataTransfer) return;
        
        const sourceSlotId = parseInt(event.dataTransfer.getData('text/plain'));
        if (sourceSlotId !== undefined && sourceSlotId !== targetSlotId) {
            this.inventorySystem.moveItem(sourceSlotId, targetSlotId);
        }
    }

    private showItemTooltip(event: MouseEvent, item: Item, quantity: number): void {
        const tooltipContent = this.getItemTooltip(item, quantity);
        
        this.elements.tooltip.innerHTML = tooltipContent;
        this.elements.tooltip.style.display = 'block';
        
        // Position tooltip
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        this.elements.tooltip.style.left = `${rect.left + rect.width + 10}px`;
        this.elements.tooltip.style.top = `${rect.top}px`;
        this.elements.tooltip.style.transform = 'none';
    }

    private getItemTooltip(item: Item, quantity: number): string {
        const rarityColors: { [key: string]: string } = {
            common: '#9ca3af',
            magic: '#3b82f6',
            rare: '#eab308',
            legendary: '#f97316',
            unique: '#8b5cf6'
        };
        
        const color = rarityColors[item.rarity] || '#9ca3af';
        
        let tooltip = `
            <div style="color: ${color}; font-weight: bold; font-size: 14px;">
                ${item.name}${quantity > 1 ? ` (${quantity})` : ''}
            </div>
            <div style="color: #999; font-size: 11px; margin-top: 2px;">
                ${item.type} • Level ${item.level} • ${item.rarity}
            </div>
            <div style="margin-top: 8px; color: #ccc; font-size: 12px;">
                ${item.description}
            </div>
        `;
        
        if (Object.keys(item.stats).length > 0) {
            tooltip += '<div style="margin-top: 8px; color: #88f; font-size: 11px;">';
            Object.entries(item.stats).forEach(([stat, value]) => {
                tooltip += `<div>+${value} ${stat.replace('_', ' ')}</div>`;
            });
            tooltip += '</div>';
        }
        
        tooltip += `<div style="margin-top: 8px; color: #ffd700; font-size: 11px;">Value: ${item.value} gold</div>`;
        
        return tooltip;
    }

    public update(player: Player): void {
        // Cache player reference for skill effects
        this.player = player;
        
        // Update character stats
        this.elements.playerLevel.textContent = player.getLevel().toString();
        this.elements.healthText.textContent = `${player.getHealth()}/${player.getMaxHealth()}`;
        this.elements.manaText.textContent = `${player.getMana()}/${player.getMaxMana()}`;

        // Update orb values
        this.elements.healthValue.textContent = player.getHealth().toString();
        this.elements.manaValue.textContent = player.getMana().toString();

        // Update position (rounded to 1 decimal place)
        const pos = player.getPosition();
        this.elements.playerPos.textContent = `${pos.x.toFixed(1)}, ${pos.z.toFixed(1)}`;

        // Update experience bar
        const expPercentage = player.getExperiencePercentage();
        this.elements.expFill.style.width = `${expPercentage}%`;

        // Update health orb visual state
        const healthPercentage = player.getHealthPercentage();
        if (healthPercentage < 25) {
            this.elements.healthOrb.style.animation = 'orbPulse 0.5s ease-in-out infinite';
        } else {
            this.elements.healthOrb.style.animation = 'orbPulse 2s ease-in-out infinite';
        }

        // Update mana orb visual state
        const manaPercentage = player.getManaPercentage();
        if (manaPercentage < 25) {
            this.elements.manaOrb.style.animation = 'orbPulse 0.5s ease-in-out infinite';
        } else {
            this.elements.manaOrb.style.animation = 'orbPulse 2s ease-in-out infinite';
        }
    }

    public showMessage(message: string, duration: number = 3000): void {
        // Create a temporary message element
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(145deg, rgba(212, 175, 55, 0.95), rgba(255, 215, 0, 0.95));
            color: #000;
            padding: 15px 25px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            z-index: 1500;
            pointer-events: none;
            border: 2px solid #ffd700;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
            text-shadow: none;
        `;

        document.body.appendChild(messageElement);

        // Fade out animation
        setTimeout(() => {
            messageElement.style.transition = 'opacity 0.5s ease-out';
            messageElement.style.opacity = '0';
            
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 500);
        }, duration - 500);
    }

    public updateInventory(items: string[]): void {
        // TODO: Implement inventory system with actual items
        console.log('Inventory updated:', items);
    }
}