import * as THREE from "three";

let prev_point_counts = 0;
let points: number[] | null = null;

export const receivePoints = (data: number[]) => {
	points = data;
}

let camera: THREE.OrthographicCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;

export const resizeCanvas = () => {
	renderer?.setSize(window.innerWidth, window.innerHeight);

	const SIZE = 1;
	let camera_width;
	let camera_height;
	if (window.innerWidth <= window.innerHeight) {
		camera_width = SIZE;
		camera_height = SIZE / window.innerWidth * window.innerHeight;
	} else {
		camera_width = SIZE / window.innerHeight * window.innerWidth;
		camera_height = SIZE;
	}
	camera = new THREE.OrthographicCamera(camera_width / -2, camera_width / 2, camera_height / -2, camera_height / 2);
	camera.up.set(0, -1, 0);
	camera.position.set(0, 0, -10);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
}

window.addEventListener("DOMContentLoaded", () => {
	const canvasContainer = document.querySelector('#canvasContainer') as HTMLCanvasElement;

	renderer = new THREE.WebGLRenderer({
		canvas: canvasContainer,
	});

	resizeCanvas();

	const scene = new THREE.Scene();

	let geometry: THREE.BufferGeometry | null = null;
	let pointsMesh: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial> | null = null;

	function animate() {
		if (points !== null) {
			if (points.length != prev_point_counts) {
				if (pointsMesh) {
					scene.remove(pointsMesh);
				}
				geometry = new THREE.BufferGeometry();
				geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
				const material = new THREE.PointsMaterial({
					size: 1,
					color: 0xffffff,
				});
				// material.onBeforeCompile = (shader) => {
				// 	const keyword = 'uniform float size;';
				// 	shader.vertexShader = shader.vertexShader.replace(keyword, 'attribute float size;');
				// };

				pointsMesh = new THREE.Points(geometry, material);
				scene.add(pointsMesh);
				prev_point_counts = points.length;
			} else {
				geometry?.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
			}

			points = null;
		}
		if (camera) {
			renderer?.render(scene, camera);
		}
		requestAnimationFrame(animate);
	};

	animate();
});