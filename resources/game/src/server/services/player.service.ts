class PlayerService {
	protected static instance: PlayerService;

	static getInstance(): PlayerService {
		if (!PlayerService.instance) {
			PlayerService.instance = new PlayerService()
		}

		return PlayerService.instance;
	}

	getPlayerIdentifier(playerId: number, type: string): string | undefined {
		return getPlayerIdentifiers(playerId).find((identifier) => identifier.includes(`${type}:`));
	}

}

export default PlayerService.getInstance();
