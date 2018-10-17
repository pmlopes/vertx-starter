import riot from 'riot';
import './tags/main.tag';
import './tags/navigation.tag';
import {buildtools, components, presets} from './gen/metadata.json';

riot.mount('*', {buildtools: buildtools, components: components, presets: presets});
