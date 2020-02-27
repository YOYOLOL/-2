const { Client } = require('discord.js');
const Enmap = require("enmap");

module.exports = class extends Client {
	constructor(config) {
		super({
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
		});

		this.commands = new Enmap();

		this.queue = new Map();

		this.config = config;
	}
};
