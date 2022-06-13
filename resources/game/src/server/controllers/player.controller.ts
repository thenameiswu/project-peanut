import { netEvent, eventListener } from '../lib/decorators/events';

import Logger from '../lib/misc/logger';
import PlayerService from "../services/player.service";
import Player from '../structures/player';

const LOGGER_COMPONENT = 'Player Controller'

/**
 *
 * Debug - Need to separate this to a shared resource..
 */

const addDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const getPlayerId = () => (global as any).source;

@eventListener()
class PlayerController {
	playersBySource: Map<number, Player> = new Map();

	@netEvent('playerConnecting')
	async onConnect(name: string, sKr: () => void, deferrals: Game.Deferrals, playerId: number = getPlayerId()) {
		deferrals.defer();

		// Resolve the player and check if their license is valid and present..
		await addDelay(100);
		deferrals.update(`Resolving player..`);

		/*
			const player = await this.resolvePlayer(playerId)
			if (!player) {
				await addDelay(100);
				return deferrals.done(`There was an error while resolving your license..`);
			}
		 */

		// Check if the player is banned from the server. Ensure that we're checking each of their identifiers and tokens against the database to prevent ban evasion..
		deferrals.update(`Checking ban status..`);

		await addDelay(100);
		deferrals.done();
	}

	@netEvent('playerDropped')
	onDisconnect(reason: string, playerId: number = getPlayerId()) {
		Logger.Info(LOGGER_COMPONENT, `${GetPlayerName(playerId.toString())} is disconnecting from the server..`)
	}

	@netEvent('Peanut:Server:PlayerJoin')
	onJoin(playerId: number = getPlayerId()) {
		const license = PlayerService.getPlayerIdentifier(playerId, 'license');

		if (!license) {
			return DropPlayer(playerId.toString(), `Our framework is having trouble locating one of your identifiers, so we've kicked you as a precaution..`)
		}

		try {
			const player = new Player( {playerId, license, username: GetPlayerName(playerId.toString()) } );

			this.playersBySource.set(playerId, player);
			Logger.Info(LOGGER_COMPONENT, `${GetPlayerName(playerId.toString())} is connecting to the server..`)

		} catch(err) {
			console.error(err);
		}
	}

	@netEvent('onResourceStart')
	onResourceStart(name: string) {
		if (name !== GetCurrentResourceName())
			return;

		getPlayers()?.forEach(async (playerId) => {
			this.onJoin(parseInt(playerId))
		})
	}

}

export default new PlayerController();