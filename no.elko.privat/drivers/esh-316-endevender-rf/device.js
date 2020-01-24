'use strict';

const { ZigBeeDevice } = require('homey-meshdriver');
const maxBrightness = 255;
class ESH316RF extends ZigBeeDevice {

	onMeshInit()
	{
		this.log('ESH316RF has been inited');
		this.enableDebug();
		this.printNode();


		//  this.registerAttrReportListener(
		//  	'genOnOff', // Cluster
		//  	'onOff', // Attr
		//  	2, // Min report interval in seconds (must be greater than 1)
		//  	300, // Max report interval in seconds (must be zero or greater than 60 and greater than min report interval)
		//  	1, // Report change value, if value changed more than this value send a report
		//  	this.onOnOffReport.bind(this)) // Callback with value
		//  	.then(() => {
		 		// Registering attr reporting succeeded
		// 		this.log('registered attr report listener');
		// 	})
		// 	.catch(err => {
		// 		// Registering attr reporting failed
		// 		this.error('failed to register attr report listener', err);
		// 	});

		this.registerReportListener('genLevelCtrl', 'step', value => {
			// stepmode is 1 when turning left, 0 when turning right
			var dimValue = value['stepmode'] === 1 ? -0.1 : 0.1;
			var currentValue = this.getCapabilityValue('dim');
			currentValue = currentValue === null ? 0.5 : currentValue;
			currentValue = currentValue + dimValue;
			currentValue = currentValue > 1 ? 1 : currentValue;
			currentValue = currentValue < 0 ? 0 : currentValue;
			
			this.setCapabilityValue('dim', currentValue);
		});
		this.registerReportListener('genOnOff', 'toggle', value => {
			this.log('wat', value);

			this.setCapabilityValue('onoff', !this.getCapabilityValue('onoff'));
		});



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


		this.node.on('command', (command) => {
	  		this.log(command);
		});


		//register att reportlisteners for onoff
	//	this.registerAttrReportListener('genOnOff', 'onOff', 2, 300, 1, value => {
//			this.log('onoff', value);
			//this.setCapabilityValue('onoff', value === 1);
//		}, 0);





		  //register att reportlisteners for dim
		//this.registerAttrReportListener('genLevelCtrl', 'currentLevel', 2, 300, 1, value => {
	//		this.log('dim report', value);
			//this.setCapabilityValue('dim', value / maxBrightness);
	//	}, 0);
	}

	onOnOffReport(value) {
		this.log('onPowerCfgBatteryPercentageRemainingReport', value);
	}
	

}

module.exports = ESH316RF;
