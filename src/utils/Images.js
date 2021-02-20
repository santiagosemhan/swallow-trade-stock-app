import { Appearance } from 'react-native';
import config from '../constants/config';

const getBrandImage = () => {
    const img = Appearance.getColorScheme() === 'dark' ?
        config.brandImageDark :
        config.brandImage;
    return img;
};

export default {
    getBrandImage,
};