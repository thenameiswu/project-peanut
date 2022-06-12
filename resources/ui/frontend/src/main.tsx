import { render } from 'preact';
import { Socket } from 'socket.io-client';

import App from './app'

import './dev/index'

export default (socket: Socket) => {
	render(<App socket={socket} />, document.getElementById('app')!);

	const restartUI = () => window.location.reload();
}