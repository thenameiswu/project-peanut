class Logger {
	protected static instance: Logger;

	static getInstance(): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}

		return Logger.instance;
	}

	Info(component: string, log: string) {
		this.handleOutput('info', component, log);
	}

	Warn(component: string, log: string) {
		this.handleOutput('warn', component, log);
	}

	Error(component: string, log: string) {
		this.handleOutput('error', component, log);
	}

	private handleOutput(level: string, component: string, log: string) {
		let formattedOutput: string;

		switch (level) {
			case 'warn':
				formattedOutput = `[^3WARN^7]\t[^5${component}^7] ${log}`;
				break;
			case 'error':
				formattedOutput = `[^1ERROR^7]\t[^5${component}^7] ${log}`;
				break;
			default:
				formattedOutput = `[^5INFO^7]\t[^5${component}^7] ${log}`;
				break;
		}

		console.log(formattedOutput)
	}

}

export default Logger.getInstance();