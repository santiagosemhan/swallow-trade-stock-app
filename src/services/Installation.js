import { Platform, AsyncStorage, Alert } from 'react-native';
import Parse from 'parse/react-native';

const createDevice = async (installationId, deviceType) => {
    try {
        const device = new Parse.Object('Device');
        device.set('uuid', installationId);
        device.set('active', true);
        device.set('description', deviceType);
        await device.save();
        await registerSensor(device);
        return device;
    } catch (originalError) {
        try {
            if (originalError.code === 400) {
                await Parse.Cloud.run('enableReadPermissionToDeviceToUser', { uuid: installationId });
                const device = await new Parse.Query('Device').equalTo('uuid', installationId).first();
                return device;
            } else {
                throw new Error(originalError.message);
            }
        } catch (error) {
            Alert.alert('', error.message);
        }
    }
};

const registerSensor = async (device) => {
    try {
        const sensor = new Parse.Object('Sensor');
        sensor.set('device', device);
        sensor.set('name', 'geopoint');
        await sensor.save();
    } catch (error) {
        Alert.alert('', error.message);
    }
};

export const setDeviceInstallation = async (password) => {
    try {
        const installationId = await Parse._getInstallationId();
        const deviceType = Platform.OS == 'android' ? 'android' : 'ios';
        const pushType = Platform.OS == 'android' ? 'fcm' : '';
        const localeIdentifier = 'es-AR';
        const newInstallation = new Parse.Installation();
        newInstallation.set('deviceType', deviceType);
        newInstallation.set('installationId', installationId);
        newInstallation.set('channels', ["All"]);
        newInstallation.set('pushType', pushType);
        newInstallation.set('timeZone', 'America/Argentina/Buenos_Aires');
        newInstallation.set('appName', 'Truck Sensbox');
        newInstallation.set('appIdentifier', 'com.sensbox.truck');
        newInstallation.set('localeIdentifier', localeIdentifier);
        await newInstallation.save();
        let device = await new Parse.Query('Device').equalTo('uuid', installationId).first();
        if (!device) {
            device = await createDevice(installationId, deviceType);
        }
        const { key } = await Parse.Cloud.run('requestDeviceKey', { uuid: installationId, password });
        device.set('key', key);
        await Parse.Cloud.run('updateCurrentDeviceForUserTrucks');
        await AsyncStorage.setItem('device', JSON.stringify(device.toJSON()));
    } catch (err) {
        console.log('Error!! ' + err);
    }
};

export default {
    setDeviceInstallation,
};