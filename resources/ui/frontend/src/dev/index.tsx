import {io} from "socket.io-client";

import App from '../main'

const awaitUI = (evtName: string, ...args: any[]) => {
	const message = new MessageEvent('message', {
		data: {
			type: 'event',
			evtName: evtName,
			args: args
		}
	})

	dispatchEvent(message);
}

(window as any).awaitUI = awaitUI;

const eventListeners: Map<string, ((...args: any[]) => void)[]> = new Map();

export const onClient = (evtName: string, callback: (...args: any[]) => void) => {
	if (!eventListeners.has(evtName)) {
		eventListeners.set(evtName, []);
	}

	eventListeners.get(evtName)?.push(callback);
}

window.addEventListener('message', async (message) => {
	const eventInfo = message.data;

	if (eventInfo.type === 'event') {
		const { evtName, args } = eventInfo;

		const listeners = eventListeners.get(evtName);
		if (!listeners) {
			return;
		}

		listeners.forEach((listener) => {
			Promise.resolve(listener(...args));
		})

		return;
	}
})

const loadApp = async () => {
	// setup client and server sockets...
	const clientSocket = io('http://localhost:3001/user', {
		path: '/peanut-socket',
		reconnectionAttempts: 0,
		autoConnect: false,
		auth: {}
	})

	/*
		clientSocket.auth = { auth = '' }
	*/

	App(clientSocket);

	/*
		 clientSocket.connect()

		 (window as any).emitServer = (evtName: string, ...args: any[]) => {
			serverSocket.emit(evtName, ...args)
		 }
	 */
}

setTimeout(async () => {
	await loadApp();
}, 300)

export {}