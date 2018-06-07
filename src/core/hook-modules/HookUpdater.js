const path = require("path");

const base = path.resolve(".");

const pyHandler = require(base + "/src/core/pythonHandler");
const hooks = require(base + "/cfg/hooks.json");
const configHandler = require(base + "/src/core/configHandler");

class HookUpdater {
	constructor(id, interval, server) {
		this.id = id;
		this.interval = interval;
		this.server = server;
	}

	/**
	 * Calls the hook and and schedules the next call
	 */
	nextCall() {
		var cfgName = "hooks";

		//Non-editable
		var type = hooks[this.id].type;
		var path = hooks[this.id].path;

		//Editable
		var channelId = configHandler.readJSON(cfgName, this.server.id, this.id, "channel");
		this.interval = configHandler.readJSON(cfgName, this.server.id, this.id, "interval");
		var running = configHandler.readJSON(cfgName, this.server.id, this.id,"running");
		var channel = this.server.channels.get(channelId);

		//Run script
		if (running) {
			if (type === "js") {
				require("./../../../" + path).hook(channel);
			} else if (type === "python") {
				pyHandler.run(path, "", channel);
			}
			setTimeout(() => {
				this.nextCall();
			}, this.interval)
		}
	}
}

module.exports = HookUpdater;