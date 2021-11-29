// @ts-nocheck
import * as sql from 'sql';

sql.setDialect('sqlite');
export const rides = sql.define({
  name: 'Rides',
  columns: ['rideID', 'startLat', 'startLong', 'endLat', 'endLong', 'riderName', 'driverName', 'driverVehicle'],
});