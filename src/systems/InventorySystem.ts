export interface Item {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material';
    rarity: 'common' | 'magic' | 'rare' | 'legendary' | 'unique';
    level: number;
    stats: { [key: string]: number };
    description: string;
    icon?: string;
    stackSize?: number;
    value: number;
}

export interface InventorySlot {
    item: Item | null;
    quantity: number;
    slotId: number;
}

export class InventorySystem {
    private slots: InventorySlot[] = [];
    private maxSlots: number = 40;
    private onInventoryChanged?: () => void;

    constructor() {
        this.initializeSlots();
    }

    private initializeSlots(): void {
        for (let i = 0; i < this.maxSlots; i++) {
            this.slots.push({
                item: null,
                quantity: 0,
                slotId: i
            });
        }
    }

    public addItem(item: Item, quantity: number = 1): boolean {
        // Check if item can stack with existing items
        if (item.stackSize && item.stackSize > 1) {
            const existingSlot = this.slots.find(slot => 
                slot.item && 
                slot.item.id === item.id && 
                slot.quantity < item.stackSize!
            );

            if (existingSlot) {
                const canAdd = Math.min(quantity, item.stackSize! - existingSlot.quantity);
                existingSlot.quantity += canAdd;
                quantity -= canAdd;
                
                if (quantity <= 0) {
                    this.notifyInventoryChanged();
                    return true;
                }
            }
        }

        // Find empty slot
        const emptySlot = this.slots.find(slot => slot.item === null);
        if (emptySlot && quantity > 0) {
            emptySlot.item = { ...item };
            emptySlot.quantity = Math.min(quantity, item.stackSize || 1);
            this.notifyInventoryChanged();
            return true;
        }

        return false; // Inventory full
    }

    public removeItem(slotId: number, quantity: number = 1): Item | null {
        const slot = this.slots[slotId];
        if (!slot || !slot.item) return null;

        const removedItem = { ...slot.item };
        slot.quantity -= quantity;

        if (slot.quantity <= 0) {
            slot.item = null;
            slot.quantity = 0;
        }

        this.notifyInventoryChanged();
        return removedItem;
    }

    public moveItem(fromSlotId: number, toSlotId: number): boolean {
        if (fromSlotId === toSlotId) return false;

        const fromSlot = this.slots[fromSlotId];
        const toSlot = this.slots[toSlotId];

        if (!fromSlot || !fromSlot.item) return false;

        // If target slot is empty
        if (!toSlot.item) {
            toSlot.item = fromSlot.item;
            toSlot.quantity = fromSlot.quantity;
            fromSlot.item = null;
            fromSlot.quantity = 0;
            this.notifyInventoryChanged();
            return true;
        }

        // If same item type and can stack
        if (toSlot.item.id === fromSlot.item.id && 
            fromSlot.item.stackSize && 
            toSlot.quantity < fromSlot.item.stackSize) {
            
            const canMove = Math.min(
                fromSlot.quantity, 
                fromSlot.item.stackSize - toSlot.quantity
            );
            
            toSlot.quantity += canMove;
            fromSlot.quantity -= canMove;
            
            if (fromSlot.quantity <= 0) {
                fromSlot.item = null;
                fromSlot.quantity = 0;
            }
            
            this.notifyInventoryChanged();
            return true;
        }

        // Swap items
        const tempItem = toSlot.item;
        const tempQuantity = toSlot.quantity;
        
        toSlot.item = fromSlot.item;
        toSlot.quantity = fromSlot.quantity;
        
        fromSlot.item = tempItem;
        fromSlot.quantity = tempQuantity;
        
        this.notifyInventoryChanged();
        return true;
    }

    public getSlot(slotId: number): InventorySlot | null {
        return this.slots[slotId] || null;
    }

    public getAllSlots(): InventorySlot[] {
        return [...this.slots];
    }

    public findItemsByType(type: string): InventorySlot[] {
        return this.slots.filter(slot => 
            slot.item && slot.item.type === type
        );
    }

    public getInventoryValue(): number {
        return this.slots.reduce((total, slot) => {
            if (slot.item) {
                return total + (slot.item.value * slot.quantity);
            }
            return total;
        }, 0);
    }

    public setInventoryChangedCallback(callback: () => void): void {
        this.onInventoryChanged = callback;
    }

    private notifyInventoryChanged(): void {
        if (this.onInventoryChanged) {
            this.onInventoryChanged();
        }
    }

    public isEmpty(): boolean {
        return this.slots.every(slot => slot.item === null);
    }

    public isFull(): boolean {
        return this.slots.every(slot => slot.item !== null);
    }

    // Generate sample items for testing
    public static createSampleItems(): Item[] {
        return [
            {
                id: 'sword_001',
                name: 'Iron Sword',
                type: 'weapon',
                rarity: 'common',
                level: 5,
                stats: { damage: 25, strength: 3 },
                description: 'A sturdy iron sword forged by skilled blacksmiths.',
                value: 150,
                stackSize: 1
            },
            {
                id: 'health_potion',
                name: 'Health Potion',
                type: 'consumable',
                rarity: 'common',
                level: 1,
                stats: { healing: 50 },
                description: 'Restores 50 health points when consumed.',
                value: 25,
                stackSize: 20
            },
            {
                id: 'mana_potion',
                name: 'Mana Potion',
                type: 'consumable',
                rarity: 'common',
                level: 1,
                stats: { mana: 30 },
                description: 'Restores 30 mana points when consumed.',
                value: 20,
                stackSize: 20
            },
            {
                id: 'leather_armor',
                name: 'Leather Armor',
                type: 'armor',
                rarity: 'common',
                level: 3,
                stats: { defense: 15, agility: 2 },
                description: 'Light armor made from supple leather.',
                value: 100,
                stackSize: 1
            },
            {
                id: 'magic_ring',
                name: 'Ring of Power',
                type: 'accessory',
                rarity: 'magic',
                level: 10,
                stats: { intelligence: 5, mana: 20 },
                description: 'A ring imbued with magical energy.',
                value: 500,
                stackSize: 1
            },
            {
                id: 'fire_staff',
                name: 'Staff of Flames',
                type: 'weapon',
                rarity: 'rare',
                level: 15,
                stats: { damage: 45, intelligence: 8, fire_damage: 12 },
                description: 'A powerful staff that channels the essence of fire.',
                value: 800,
                stackSize: 1
            }
        ];
    }
}