import Logger from '../lib/misc/logger'

interface PlayerInfo {
	playerId: number;
	license: string;
	username: string;
}

class Player {
	readonly playerId;
	readonly license;
	readonly username;

	constructor({ playerId, license, username }: PlayerInfo) {
		this.license = license;
		this.playerId = playerId;
		this.username = username;
	}

	kickPlayer(reason: string) {
		Logger.Info('Player Controller', `${this.username} has been successfully kicked from the server..`)
		return DropPlayer(this.playerId.toString(), `reason`)
	}

	emitClient(event: string, ...args: any[]) {
		emitNet(event, this.playerId, ...args)
	}

}

export default Player;