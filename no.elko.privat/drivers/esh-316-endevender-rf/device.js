'use strict';

const {
	ZigBeeDevice
} = require('homey-meshdriver');

class ESH316RF extends ZigBeeDevice {

	onMeshInit() {

		// It's problematic when turning the knob quickly, which causes aggressive update of the capability value
		// Would be great if we could throttle somehow, or accumulate multiple successive report before setting the value.
		this.registerReportListener('genLevelCtrl', 'step', value => {
			// stepmode is 1 when turning left, 0 when turning right
			// Figure out how to let the user configure the magnitude of the delta in the app
			var dimDelta = value['stepmode'] === 1 ? -0.1 : 0.1;
			var currentValue = this.getValueOrDefault(this.getCapabilityValue('dim'), 0.5);

			// Keep within range [0.1, 1]
			var newValue = Math.max(0.1, Math.min(1, currentValue + dimDelta));
			if (currentValue != newValue) {
				this.setCapabilityValue('dim', newValue);
			}
		});


		this.registerReportListener('genOnOff', 'toggle', value => {
				var currentValue = this.getValueOrDefault(this.getCapabilityValue('onoff'), false);
				this.setCapabilityValue('onoff', !currentValue);
				});

		}

		getValueOrDefault(value, defaultValue) {
			return value === null ? defaultValue : value;
		}


	}

	module.exports = ESH316RF;

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