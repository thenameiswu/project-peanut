import 'reflect-metadata';

// Controllers
import './controllers/spawn.controller'


on('onResourceStart', (name: string) => {
	if (name !== GetCurrentResourceName()) {
		return;
	}

	setTimeout(() => {
		console.log(`^3
  _____           _           _     _____                       _   
 |  __ \\         (_)         | |   |  __ \\                     | |  
 | |__) | __ ___  _  ___  ___| |_  | |__) |__  __ _ _ __  _   _| |_ 
 |  ___/ '__/ _ \\| |/ _ \\/ __| __| |  ___/ _ \\/ _\` | '_ \\| | | | __|
 | |   | | | (_) | |  __/ (__| |_  | |  |  __/ (_| | | | | |_| | |_ 
 |_|   |_|  \\___/| |\\___|\\___|\\__| |_|   \\___|\\__,_|_| |_|\\__,_|\\__|
                _/ |                                                
               |__/                                                 
		^0`)
	}, 500)
})