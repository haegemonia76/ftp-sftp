import { Stats as fsStats } from 'fs';

export default class Stats extends fsStats {
    name?: String;
}