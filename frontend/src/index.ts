import * as THREE from "three";
import * as monaco from 'monaco-editor';
import { io } from "socket.io-client";
import 'normalize.css';
import './index.css';

window.addEventListener("DOMContentLoaded", () => {
	const loadValue = () => {
		const localValue = localStorage.getItem('editor_content');
		if (localValue !== null) {
			return localValue;
		} else {
			return ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n');
		}
	}

	const container = document.querySelector('#root') as HTMLDivElement;
	const editor = monaco.editor.create(container, {
		value: loadValue(),
		language: 'javascript',
		minimap: {
			enabled: false,
		}
	});
	const model = editor.getModel();
	if (model) {
		model.onDidChangeContent((event) => {
			localStorage.setItem('editor_content', model!.getValue());
		});
	}

	const socket = io();

	const submitButton = document.querySelector('#submit') as HTMLButtonElement;
	submitButton.addEventListener('click', () => {
		socket.emit('code', model!.getValue());
	});
});