'use strict';

const Homey = require('homey');
const {
	ZigBeeDevice
} = require('homey-meshdriver');

class EDRZHA extends ZigBeeDevice {

	onMeshInit() {

		this.registerReportListener('genOnOff', 'toggle', this.toggleCommandParser.bind(this));
		this.registerReportListener('genLevelCtrl', 'step', this.stepCommandParser.bind(this));

		this.switchToggleTriggerDevice = new Homey.FlowCardTriggerDevice('EDRZHA_toggle').register();
       	this.switchDimTriggerDevice = new Homey.FlowCardTriggerDevice('EDRZHA_dim').register().registerRunListener((args, state, callback) => {
        	return callback(null, args.action === state.action);
      });
	}

	toggleCommandParser(report) {
		return this.switchToggleTriggerDevice.trigger(this, {}, {})
			.then(() => this.log('triggered EDRZHA_toggle'))
			.catch(err => this.error('Error triggering EDRZHA_toggle', err));
	}

	stepCommandParser(report) {
		var direction = report.stepmode === 0 ? 'right-turned' : 'left-turned';

		return this.switchDimTriggerDevice.trigger(this, {}, {
				action: `${direction}`
			})
			.then(() => this.log(`triggered EDRZHA_dim, action=${direction}`))
			.catch(err => this.error('Error triggering EDRZHA_dim', err));
	}
}

module.exports = EDRZHA;

// 2020-01-23 22:58:13 [log] [ManagerDrivers] [esh-316-endevender-rf] [0] { token: '7b55a008-5775-4bb2-b3e0-7f71eb39d63a',
// device: '0x000d6f000e9cbbf6',
// endpoint: '0',
// cluster: 'genOnOff',
// attr: 'toggle',
// value:
//  { src: { epId: 1, ieeeAddr: '0x000d6f000e9cbbf6', nwkAddr: 58125 },
//    command: 'toggle' },
// event: 'command' }


// 2020-01-23 22:54:46 [log] [ManagerDrivers] [esh-316-endevender-rf] [0] { token: 'fd1dfece-ae12-4f5f-84f4-4342795dc686',
// device: '0x000d6f000e9cbbf6',
// endpoint: '0',
// cluster: 'genLevelCtrl',
// attr: 'step',
// value:
//  { stepmode: 0,
//    stepsize: 12,
//    transtime: 65535,
//    src: { epId: 1, ieeeAddr: '0x000d6f000e9cbbf6', nwkAddr: 56436 },
//    command: 'step' },
// event: 'command' }