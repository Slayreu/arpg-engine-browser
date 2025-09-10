export class InputManager {
    private canvas: HTMLCanvasElement;
    private keys: Set<string> = new Set();
    private mousePosition: { x: number; y: number } = { x: 0, y: 0 };

    // Event callbacks
    public onMouseClick?: (x: number, y: number) => void;
    public onKeyPress?: (key: string) => void;
    public onKeyRelease?: (key: string) => void;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Mouse events
        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            if (this.onMouseClick) {
                this.onMouseClick(x, y);
            }
        });

        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePosition.x = event.clientX - rect.left;
            this.mousePosition.y = event.clientY - rect.top;
        });

        // Keyboard events
        document.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();
            if (!this.keys.has(key)) {
                this.keys.add(key);
                if (this.onKeyPress) {
                    this.onKeyPress(key);
                }
            }
        });

        document.addEventListener('keyup', (event) => {
            const key = event.key.toLowerCase();
            this.keys.delete(key);
            if (this.onKeyRelease) {
                this.onKeyRelease(key);
            }
        });

        // Mouse wheel for zoom (future feature)
        this.canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            // TODO: Implement camera zoom
        });

        // Context menu prevention for right-click
        this.canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
    }

    public update(): void {
        // Process held keys for continuous actions
        for (const key of this.keys) {
            if (['w', 'a', 's', 'd'].includes(key)) {
                if (this.onKeyPress) {
                    this.onKeyPress(key);
                }
            }
        }
    }

    public isKeyPressed(key: string): boolean {
        return this.keys.has(key.toLowerCase());
    }

    public getMousePosition(): { x: number; y: number } {
        return { ...this.mousePosition };
    }

    public cleanup(): void {
        // Remove event listeners if needed
        // This would be called when the game is destroyed
    }
}