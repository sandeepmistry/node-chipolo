node-chipolo
============

node.js lib for the [Chipolo](http://www.chipolo.net)

Install
-------

npm install chipolo

Usage
-----

    var Chipolo = require('chipolo');

__Discover__

    Chipolo.discover(callback(chipolo));

Color:

    var color = chipolo.color;
 
__Connect__

    chipolo.connect(callback);

__Disconnect__

    chipolo.disconnect(callback);

__Discover Services and Characteristics__

    chipolo.discoverServicesAndCharacteristics(callback);

__Pair__

Make sure Chipolo is not "paired" with other device first. Otherwise ```success``` will always return ```false```.

    chipolo.pair(callback(success)); // success: true | false

__Device Info__

    chipolo.readModelNumber(callback(modelNumber));

    chipolo.readSerialNumber(callback(serialNumber));

    chipolo.readFirmwareRevision(callback(firmwareRevision));

    chipolo.readHardwareRevision(callback(hardwareRevision));

    chipolo.readSoftwareRevision(callback(softwareRevision));

    chipolo.readManufacturerName(callback(manufacturerName));

__Temperature___

    chipolo.readTemperature(callback(temperature)); // temperature in °C

__Battery__

    chipolo.readIsBatteryLow(callback(isBatteryLow)); // isBatteryLow: true | false

__Audio notifications__

    // inRange, outOfRange, shakeAndFind: true | false
    chipolo.setAudioNotifications(inRange, outOfRange, shakeAndFind, callback);

__Beep__

    chipolo.beep(callback);

__Distance__

    chipolo.estimateDistance(callback(estimatedDistance));

Events
------

__Disconnect__

    chipolo.on('disconnect', callback);
