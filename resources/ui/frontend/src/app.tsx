import { FunctionalComponent } from 'preact';
import { Socket } from 'socket.io-client';

const App: FunctionalComponent<{ socket: Socket }> = () => {
	return (
		<div>
			<h1>Hello, World!</h1>
		</div>
	);
};

export default App;