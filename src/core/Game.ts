import * as THREE from 'three';
import { Camera } from './Camera';
import { World } from './World';
import { Player } from '../entities/Player';
import { InputManager } from '../systems/InputManager';
import { UI } from '../ui/UI';

export class Game {
    private canvas: HTMLCanvasElement;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private camera: Camera;
    private world: World;
    private player: Player;
    private inputManager: InputManager;
    private ui: UI;
    private clock: THREE.Clock;
    private isRunning: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.clock = new THREE.Clock();
        
        // Initialize Three.js renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: true 
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x87CEEB, 1); // Sky blue background
        
        // Initialize scene
        this.scene = new THREE.Scene();
        
        // Initialize core systems
        this.camera = new Camera();
        this.world = new World();
        this.player = new Player();
        this.inputManager = new InputManager(this.canvas);
        this.ui = new UI();
    }

    public init(): void {
        this.setupRenderer();
        this.setupScene();
        this.setupEventListeners();
        
        console.log('ARPG Engine initialized successfully!');
    }

    private setupRenderer(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    private setupScene(): void {
        // Add camera to scene
        this.scene.add(this.camera.getCamera());
        
        // Initialize world
        this.world.init(this.scene);
        
        // Initialize player
        this.player.init(this.scene);
        
        // Set up isometric camera position
        this.camera.setIsometricView();
        this.camera.lookAt(this.player.getPosition());
    }

    private setupEventListeners(): void {
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Handle input
        this.inputManager.onMouseClick = (x: number, y: number) => {
            this.handleMouseClick(x, y);
        };
        
        this.inputManager.onKeyPress = (key: string) => {
            this.handleKeyPress(key);
        };
    }

    private onWindowResize(): void {
        this.camera.updateAspectRatio(window.innerWidth / window.innerHeight);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private handleMouseClick(x: number, y: number): void {
        // Convert screen coordinates to world coordinates
        const mouse = new THREE.Vector2();
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera.getCamera());

        // Check intersection with the ground plane
        const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersection = new THREE.Vector3();
        raycaster.ray.intersectPlane(groundPlane, intersection);

        if (intersection) {
            this.player.moveTo(intersection);
        }
    }

    private handleKeyPress(key: string): void {
        const cameraSpeed = 0.5;
        
        switch (key.toLowerCase()) {
            case 'w':
                this.camera.moveForward(cameraSpeed);
                break;
            case 's':
                this.camera.moveBackward(cameraSpeed);
                break;
            case 'a':
                this.camera.moveLeft(cameraSpeed);
                break;
            case 'd':
                this.camera.moveRight(cameraSpeed);
                break;
        }
    }

    public start(): void {
        this.isRunning = true;
        this.gameLoop();
    }

    public stop(): void {
        this.isRunning = false;
    }

    private gameLoop(): void {
        if (!this.isRunning) return;

        requestAnimationFrame(() => this.gameLoop());

        const deltaTime = this.clock.getDelta();
        
        // Update game systems
        this.update(deltaTime);
        
        // Render the scene
        this.render();
    }

    private update(deltaTime: number): void {
        // Update player
        this.player.update(deltaTime);
        
        // Update UI
        this.ui.update(this.player);
        
        // Update input
        this.inputManager.update();
    }

    private render(): void {
        this.renderer.render(this.scene, this.camera.getCamera());
    }
}