var async = require('async');

var Chipolo = require('./index');

Chipolo.discover(function(chipolo) {
  console.log('found chipolo ' + chipolo.toString());

  chipolo.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });

  async.series([
    function(callback) {
      console.log('connect');
      chipolo.connect(callback);
    },
    function(callback) {
      console.log('discoverServicesAndCharacteristics');
      chipolo.discoverServicesAndCharacteristics(callback);
    },
    function(callback) {
      console.log('pair');
      chipolo.pair(function(success) {
        console.log('\tsuccess = ' + success);

        callback();
      });
    },
    function(callback) {
      console.log('readSystemId');
      chipolo.readSystemId(function(systemId) {
        console.log('\tsystem id = ' + systemId);

        callback();
      });
    },
    function(callback) {
      console.log('readModelNumber');
      chipolo.readModelNumber(function(modelNumber) {
        console.log('\tmodel number = ' + modelNumber);

        callback();
      });
    },
    function(callback) {
      console.log('readSerialNumber');
      chipolo.readSerialNumber(function(serialNumber) {
        console.log('\tserial number = ' + serialNumber);

        callback();
      });
    },
    function(callback) {
      console.log('readFirmwareRevision');
      chipolo.readFirmwareRevision(function(firmwareRevision) {
        console.log('\tfirmware revision = ' + firmwareRevision);

        callback();
      });
    },
    function(callback) {
      console.log('readHardwareRevision');
      chipolo.readHardwareRevision(function(hardwareRevision) {
        console.log('\thardware revision = ' + hardwareRevision);

        callback();
      });
    },
    function(callback) {
      console.log('readSoftwareRevision');
      chipolo.readSoftwareRevision(function(softwareRevision) {
        console.log('\tsoftware revision = ' + softwareRevision);

        callback();
      });
    },
    function(callback) {
      console.log('readManufacturerName');
      chipolo.readManufacturerName(function(manufacturerName) {
        console.log('\tmanufacturer name = ' + manufacturerName);

        callback();
      });
    },
    function(callback) {
      console.log('readTemperature');
      chipolo.readTemperature(function(temperature) {
        console.log('\ttemperature = ' + temperature + ' °C');

        callback();
      });
    },
    function(callback) {
      console.log('readIsBatteryLow');
      chipolo.readIsBatteryLow(function(isBatteryLow) {
        console.log('\tis battery low = ' + isBatteryLow);

        callback();
      });
    },
    function(callback) {
      console.log('setAudioNotifications false false false');
      chipolo.setAudioNotifications(false, false, false, callback);
    },
    function(callback) {
      console.log('delay ...');
      setTimeout(callback, 1000);
    },
    function(callback) {
      console.log('setAudioNotifications true true true');
      chipolo.setAudioNotifications(true, true, true, callback);
    },
    function(callback) {
      console.log('delay ...');
      setTimeout(callback, 1000);
    },
    function(callback) {
      console.log('beep');
      chipolo.beep(callback);
    },
    function(callback) {
      console.log('delay ...');
      setTimeout(callback, 1000);
    },
    function(callback) {
      console.log('beep');
      chipolo.beep(callback);
    },
    function(callback) {
      console.log('delay ...');
      setTimeout(callback, 1000);
    },
    function(callback) {
      console.log('estimateDistance');
      chipolo.estimateDistance(function(estimatedDistance) {
        console.log('estimated distance = ' + estimatedDistance.toFixed(1));

        callback();
      });
    },
    function(callback) {
      console.log('disconnect');
      chipolo.disconnect(callback);
    }
  ]);
});
