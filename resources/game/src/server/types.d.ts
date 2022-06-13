declare namespace Game {

	interface Deferrals {
		defer: () => void;
		update: (message: string) => void;
		presentCard: (card: unknown, cb: (data: unknown, rawData: string) => void) => void;
		done: (reason?: string) => void;
	}

}