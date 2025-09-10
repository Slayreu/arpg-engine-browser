import * as THREE from 'three';

export class World {
    private scene?: THREE.Scene;
    private terrain?: THREE.Mesh;
    private lights: THREE.Light[] = [];
    private time: number = 0;

    public init(scene: THREE.Scene): void {
        this.scene = scene;
        this.createTerrain();
        this.setupLighting();
        this.addEnvironmentObjects();
    }

    private createTerrain(): void {
        if (!this.scene) return;

        // Create a large plane for the ground with more detail
        const groundGeometry = new THREE.PlaneGeometry(100, 100, 64, 64);
        
        // Create darker, more atmospheric material
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2a2520,
            transparent: false,
        });

        // Add some height variation to the terrain
        const positions = groundGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);
            const height = (Math.sin(x * 0.1) + Math.cos(z * 0.1)) * 0.5;
            positions.setY(i, height);
        }
        groundGeometry.computeVertexNormals();

        this.terrain = new THREE.Mesh(groundGeometry, groundMaterial);
        this.terrain.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        this.terrain.receiveShadow = true;
        
        this.scene.add(this.terrain);

        // Add a stone path/road texture overlay
        const pathGeometry = new THREE.PlaneGeometry(80, 80, 32, 32);
        const pathMaterial = new THREE.MeshLambertMaterial({
            color: 0x3a352a,
            transparent: true,
            opacity: 0.6
        });
        
        const path = new THREE.Mesh(pathGeometry, pathMaterial);
        path.rotation.x = -Math.PI / 2;
        path.position.y = 0.02; // Slightly above the ground
        
        this.scene.add(path);

        // Add some scattered stone tiles
        this.addScatteredTiles();
    }

    private addScatteredTiles(): void {
        if (!this.scene) return;

        for (let i = 0; i < 25; i++) {
            const tileGeometry = new THREE.PlaneGeometry(2, 2);
            const tileMaterial = new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(0.1, 0.1, 0.15 + Math.random() * 0.1),
                transparent: true,
                opacity: 0.7 + Math.random() * 0.3
            });

            const tile = new THREE.Mesh(tileGeometry, tileMaterial);
            tile.rotation.x = -Math.PI / 2;
            tile.position.set(
                (Math.random() - 0.5) * 80,
                0.01,
                (Math.random() - 0.5) * 80
            );

            this.scene.add(tile);
        }
    }

    private setupLighting(): void {
        if (!this.scene) return;

        // Darker ambient light for more atmospheric feel
        const ambientLight = new THREE.AmbientLight(0x2a1810, 0.2);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);

        // Main directional light (like sunlight filtering through clouds)
        const directionalLight = new THREE.DirectionalLight(0xffd4a3, 0.6);
        directionalLight.position.set(15, 25, 10);
        directionalLight.castShadow = true;
        
        // Configure shadow properties for better quality
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        directionalLight.shadow.bias = -0.0001;

        this.scene.add(directionalLight);
        this.lights.push(directionalLight);

        // Atmospheric hemisphere light (sky to ground gradient)
        const hemisphereLight = new THREE.HemisphereLight(0x4a4a5c, 0x2a1810, 0.4);
        this.scene.add(hemisphereLight);
        this.lights.push(hemisphereLight);

        // Add some point lights for magical atmosphere
        this.addAtmosphericLights();

        // Add fog for depth and atmosphere
        this.scene.fog = new THREE.Fog(0x1a1a2e, 20, 80);
    }

    private addAtmosphericLights(): void {
        if (!this.scene) return;

        // Flickering magical lights scattered around
        const lightColors = [0xff6b35, 0x4dabf7, 0x51cf66, 0xe599f7];
        
        for (let i = 0; i < 8; i++) {
            const color = lightColors[i % lightColors.length];
            const pointLight = new THREE.PointLight(color, 0.8, 15);
            
            // Random positions
            const x = (Math.random() - 0.5) * 60;
            const z = (Math.random() - 0.5) * 60;
            pointLight.position.set(x, 2 + Math.random() * 3, z);
            
            // Add slight flickering animation
            pointLight.userData = {
                originalIntensity: 0.8,
                flickerSpeed: 0.5 + Math.random() * 1.5
            };
            
            this.scene.add(pointLight);
            this.lights.push(pointLight);
        }
    }

    private addEnvironmentObjects(): void {
        if (!this.scene) return;

        // Add some simple environmental objects to make the world more interesting
        this.addTrees();
        this.addRocks();
        this.addRuins();
        this.addMagicalCrystals();
    }

    private addTrees(): void {
        if (!this.scene) return;

        for (let i = 0; i < 20; i++) {
            const tree = this.createTree();
            
            // Random position within the terrain bounds
            const x = (Math.random() - 0.5) * 80;
            const z = (Math.random() - 0.5) * 80;
            
            tree.position.set(x, 0, z);
            this.scene.add(tree);
        }
    }

    private createTree(): THREE.Group {
        const tree = new THREE.Group();

        // Tree trunk (more detailed)
        const trunkGeometry = new THREE.CylinderGeometry(0.25, 0.35, 2.5, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a2c1a,
            emissive: 0x0a0a00
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1.25;
        trunk.castShadow = true;
        tree.add(trunk);

        // Tree foliage (darker, more ominous)
        const foliageGeometry = new THREE.SphereGeometry(1.8, 8, 6);
        const foliageMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x1a2a1a,
            emissive: 0x000a00
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 3.5;
        foliage.castShadow = true;
        tree.add(foliage);

        // Add some gnarled branches
        for (let i = 0; i < 3; i++) {
            const branchGeometry = new THREE.CylinderGeometry(0.05, 0.08, 1.2, 4);
            const branch = new THREE.Mesh(branchGeometry, trunkMaterial);
            const angle = (i / 3) * Math.PI * 2;
            branch.position.set(
                Math.cos(angle) * 1.2,
                2.5 + Math.random() * 0.8,
                Math.sin(angle) * 1.2
            );
            branch.rotation.z = angle + Math.PI / 4;
            branch.castShadow = true;
            tree.add(branch);
        }

        return tree;
    }

    private addRocks(): void {
        if (!this.scene) return;

        for (let i = 0; i < 15; i++) {
            const rock = this.createRock();
            
            // Random position within the terrain bounds
            const x = (Math.random() - 0.5) * 90;
            const z = (Math.random() - 0.5) * 90;
            
            rock.position.set(x, 0, z);
            this.scene.add(rock);
        }
    }

    private createRock(): THREE.Mesh {
        const rockGeometry = new THREE.DodecahedronGeometry(
            0.8 + Math.random() * 0.8, // Random size
            0
        );
        const rockMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(0, 0, 0.2 + Math.random() * 0.15),
            emissive: 0x000000
        });
        
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.castShadow = true;
        rock.receiveShadow = true;
        
        // Random rotation and scaling
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        const scale = 0.5 + Math.random() * 1.5;
        rock.scale.set(scale, scale * 0.8, scale);

        return rock;
    }

    private addRuins(): void {
        if (!this.scene) return;

        // Add some ancient ruins/pillars
        for (let i = 0; i < 8; i++) {
            const ruin = this.createRuin();
            
            const x = (Math.random() - 0.5) * 70;
            const z = (Math.random() - 0.5) * 70;
            
            ruin.position.set(x, 0, z);
            this.scene.add(ruin);
        }
    }

    private createRuin(): THREE.Group {
        const ruin = new THREE.Group();
        
        // Broken pillar
        const pillarGeometry = new THREE.CylinderGeometry(0.4, 0.5, 3 + Math.random() * 2, 8);
        const pillarMaterial = new THREE.MeshLambertMaterial({
            color: 0x3a3a2a,
            emissive: 0x000000
        });
        
        const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
        pillar.position.y = pillar.geometry.parameters.height / 2;
        pillar.rotation.z = (Math.random() - 0.5) * 0.3; // Slightly tilted
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        ruin.add(pillar);
        
        // Fallen stones around it
        for (let i = 0; i < 3; i++) {
            const stoneGeometry = new THREE.BoxGeometry(
                0.5 + Math.random() * 0.5,
                0.3 + Math.random() * 0.3,
                0.4 + Math.random() * 0.4
            );
            const stone = new THREE.Mesh(stoneGeometry, pillarMaterial);
            
            const angle = (i / 3) * Math.PI * 2;
            stone.position.set(
                Math.cos(angle) * (1 + Math.random()),
                0.15,
                Math.sin(angle) * (1 + Math.random())
            );
            stone.rotation.y = Math.random() * Math.PI;
            stone.castShadow = true;
            stone.receiveShadow = true;
            ruin.add(stone);
        }
        
        return ruin;
    }

    private addMagicalCrystals(): void {
        if (!this.scene) return;

        // Add glowing magical crystals
        for (let i = 0; i < 12; i++) {
            const crystal = this.createCrystal();
            
            const x = (Math.random() - 0.5) * 85;
            const z = (Math.random() - 0.5) * 85;
            
            crystal.position.set(x, 0, z);
            this.scene.add(crystal);
        }
    }

    private createCrystal(): THREE.Group {
        const crystalGroup = new THREE.Group();
        
        // Crystal colors
        const colors = [0x4dabf7, 0x51cf66, 0xe599f7, 0xff6b35, 0xffd43b];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Main crystal
        const crystalGeometry = new THREE.ConeGeometry(0.2, 1.5, 6);
        const crystalMaterial = new THREE.MeshLambertMaterial({
            color: color,
            emissive: new THREE.Color(color).multiplyScalar(0.2),
            transparent: true,
            opacity: 0.8
        });
        
        const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
        crystal.position.y = 0.75;
        crystal.castShadow = true;
        crystalGroup.add(crystal);
        
        // Glow effect
        const glowGeometry = new THREE.SphereGeometry(0.4, 8, 6);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = 0.75;
        crystalGroup.add(glow);
        
        // Add point light for actual illumination
        const pointLight = new THREE.PointLight(color, 1, 8);
        pointLight.position.y = 0.75;
        crystalGroup.add(pointLight);
        
        return crystalGroup;
    }

    public getTerrain(): THREE.Mesh | undefined {
        return this.terrain;
    }

    public update(deltaTime: number): void {
        this.time += deltaTime;
        
        // Animate atmospheric point lights for flickering effect
        this.lights.forEach(light => {
            if (light instanceof THREE.PointLight && light.userData.flickerSpeed) {
                const flicker = Math.sin(this.time * light.userData.flickerSpeed) * 0.3 + 0.7;
                light.intensity = light.userData.originalIntensity * flicker;
            }
        });
    }
}