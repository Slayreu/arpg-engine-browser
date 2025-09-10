import * as THREE from 'three';

export class World {
    private scene?: THREE.Scene;
    private terrain?: THREE.Mesh;
    private lights: THREE.Light[] = [];

    public init(scene: THREE.Scene): void {
        this.scene = scene;
        this.createTerrain();
        this.setupLighting();
        this.addEnvironmentObjects();
    }

    private createTerrain(): void {
        if (!this.scene) return;

        // Create a large plane for the ground
        const groundGeometry = new THREE.PlaneGeometry(50, 50, 32, 32);
        
        // Create a material with a grid-like texture
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a5d23,
            transparent: true,
            opacity: 0.8
        });

        this.terrain = new THREE.Mesh(groundGeometry, groundMaterial);
        this.terrain.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        this.terrain.receiveShadow = true;
        
        this.scene.add(this.terrain);

        // Add a wireframe overlay for the grid effect
        const wireframeGeometry = new THREE.PlaneGeometry(50, 50, 25, 25);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x2d3b1a,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        wireframe.rotation.x = -Math.PI / 2;
        wireframe.position.y = 0.01; // Slightly above the ground
        
        this.scene.add(wireframe);
    }

    private setupLighting(): void {
        if (!this.scene) return;

        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);

        // Directional light (sun) for shadows and main lighting
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 5);
        directionalLight.castShadow = true;
        
        // Configure shadow properties
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -25;
        directionalLight.shadow.camera.right = 25;
        directionalLight.shadow.camera.top = 25;
        directionalLight.shadow.camera.bottom = -25;

        this.scene.add(directionalLight);
        this.lights.push(directionalLight);

        // Add some atmospheric lighting
        const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x4a5d23, 0.3);
        this.scene.add(hemisphereLight);
        this.lights.push(hemisphereLight);
    }

    private addEnvironmentObjects(): void {
        if (!this.scene) return;

        // Add some simple environmental objects to make the world more interesting
        this.addTrees();
        this.addRocks();
    }

    private addTrees(): void {
        if (!this.scene) return;

        for (let i = 0; i < 15; i++) {
            const tree = this.createTree();
            
            // Random position within the terrain bounds
            const x = (Math.random() - 0.5) * 40;
            const z = (Math.random() - 0.5) * 40;
            
            tree.position.set(x, 0, z);
            this.scene.add(tree);
        }
    }

    private createTree(): THREE.Group {
        const tree = new THREE.Group();

        // Tree trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1;
        trunk.castShadow = true;
        tree.add(trunk);

        // Tree foliage
        const foliageGeometry = new THREE.SphereGeometry(1.5, 8, 6);
        const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 3;
        foliage.castShadow = true;
        tree.add(foliage);

        return tree;
    }

    private addRocks(): void {
        if (!this.scene) return;

        for (let i = 0; i < 8; i++) {
            const rock = this.createRock();
            
            // Random position within the terrain bounds
            const x = (Math.random() - 0.5) * 45;
            const z = (Math.random() - 0.5) * 45;
            
            rock.position.set(x, 0, z);
            this.scene.add(rock);
        }
    }

    private createRock(): THREE.Mesh {
        const rockGeometry = new THREE.DodecahedronGeometry(
            0.5 + Math.random() * 0.5, // Random size
            0
        );
        const rockMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(0, 0, 0.3 + Math.random() * 0.2)
        });
        
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.castShadow = true;
        rock.receiveShadow = true;
        
        // Random rotation
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        return rock;
    }

    public getTerrain(): THREE.Mesh | undefined {
        return this.terrain;
    }
}