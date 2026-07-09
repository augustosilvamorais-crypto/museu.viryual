document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('three-container');
    const infoPanel = document.getElementById('info-panel');
    const infoTitle = document.getElementById('info-title');
    const infoDesc = document.getElementById('info-desc');
    const infoClose = document.getElementById('info-close');

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03120a);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(8, 5, 10);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.minDistance = 5;
    controls.maxDistance = 20;

    // Lights
    const ambient = new THREE.AmbientLight(0x404060);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffeedd, 1);
    directional.position.set(5, 10, 7);
    scene.add(directional);

    const fill = new THREE.DirectionalLight(0x4488ff, 0.3);
    fill.position.set(-5, 0, 5);
    scene.add(fill);

    // Ground plane (base)
    const groundGeo = new THREE.CircleGeometry(6, 64);
    const groundMat = new THREE.MeshPhongMaterial({
        color: 0x0a3a20,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    scene.add(ground);

    // Grid helper
    const grid = new THREE.GridHelper(12, 12, 0xd4af37, 0x0a3a20);
    grid.position.y = 0;
    scene.add(grid);

    // Map outline (simplified PR shape)
    const points = [];
    const shapePoints = [
        [-3, 2.5], [-1, 3.5], [1.5, 3], [3.5, 2], [4, 0], [3.5, -2],
        [2.5, -3.5], [1, -4], [-1, -3.5], [-3, -2.5], [-4, -1], [-3.5, 1]
    ];
    shapePoints.forEach(p => points.push(new THREE.Vector3(p[0], 0.05, p[1])));

    const outlineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const outlineMat = new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.6 });
    const outline = new THREE.Line(outlineGeo, outlineMat);
    scene.add(outline);

    // City markers data
    const cities = [
        { name: 'Curitiba', pos: [-3, 0.3, 0.5], desc: 'Capital do Paraná. Centro político, econômico e cultural.' },
        { name: 'Londrina', pos: [-0.5, 0.3, 2.5], desc: 'Capital do Café. Fundada em 1934, cresceu com as migrações.' },
        { name: 'Maringá', pos: [0.5, 0.3, 1.8], desc: 'Cidade-jardim planejada. Símbolo da urbanização do Norte.' },
        { name: 'Foz do Iguaçu', pos: [-3.5, 0.3, -2.5], desc: 'Cataratas do Iguaçu. Uma das 7 maravilhas naturais.' },
        { name: 'Castro', pos: [-1.5, 0.3, 1.2], desc: 'Berço do Tropeirismo. Cidade histórica.' },
        { name: 'Paranaguá', pos: [-4.2, 0.3, 1.5], desc: 'Porto mais antigo do estado. Fundado em 1648.' }
    ];

    const markers = [];

    cities.forEach(city => {
        // Marker sphere
        const sphereGeo = new THREE.SphereGeometry(0.25, 16, 16);
        const sphereMat = new THREE.MeshPhongMaterial({
            color: 0xd4af37,
            emissive: 0xd4af37,
            emissiveIntensity: 0.3
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.set(city.pos[0], city.pos[1], city.pos[2]);
        sphere.userData = { name: city.name, desc: city.desc };
        scene.add(sphere);
        markers.push(sphere);

        // Glow ring
        const ringGeo = new THREE.RingGeometry(0.3, 0.4, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xd4af37,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(city.pos[0], 0.05, city.pos[2]);
        ring.rotation.x = -Math.PI / 2;
        scene.add(ring);
    });

    // Raycaster for clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(markers);

        if (intersects.length > 0) {
            const obj = intersects[0].object;
            infoTitle.textContent = obj.userData.name;
            infoDesc.textContent = obj.userData.desc;
            infoPanel.classList.remove('hidden');
            controls.autoRotate = false;
        }
    });

    infoClose.addEventListener('click', () => {
        infoPanel.classList.add('hidden');
        controls.autoRotate = true;
    });

    // Window resize
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();

        // Pulse markers
        markers.forEach((m, i) => {
            const scale = 1 + Math.sin(Date.now() * 0.002 + i) * 0.1;
            m.scale.set(scale, scale, scale);
        });

        renderer.render(scene, camera);
    }

    animate();
});
