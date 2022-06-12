export const event = (event: string) => {
	return (target: any, key: string): void => {
		if (!Reflect.hasMetadata('events', target)) {
			Reflect.defineMetadata('events', [], target);
		}

		const netEvents = Reflect.getMetadata('events', target) as Array<any>;

		netEvents.push({
			event,
			key: key,
			net: false,
		});

		Reflect.defineMetadata('events', netEvents, target);
	};
};

export const netEvent = (event: string) => {
	return (target: any, key: string): void => {
		if (!Reflect.hasMetadata('events', target)) {
			Reflect.defineMetadata('events', [], target);
		}

		const netEvents = Reflect.getMetadata('events', target) as Array<any>;

		netEvents.push({
			event,
			key: key,
			net: true,
		});

		Reflect.defineMetadata('events', netEvents, target);
	};
};

export const eventListener = () => {
	return <T extends { new (...args: any[]): any }>(constructor: T) => {
		return class extends constructor {
			constructor(...args: any[]) {
				super(...args);

				if (!Reflect.hasMetadata('events', this)) {
					Reflect.defineMetadata('events', [], this);
				}

				const events = Reflect.getMetadata('events', this) as Array<any>;

				for (const { net, event, key } of events) {
					if (net) {
						onNet(event, (...args: any[]) => {
							this[key](...args);
						});
					} else {
						on(event, (...args: any[]) => {
							this[key](...args);
						});
					}
				}
			}
		};
	};
};
