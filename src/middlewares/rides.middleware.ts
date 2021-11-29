import { HttpStatus } from '../shared/http/httpStatus';
import { RIDES_VALIDATION_ERROR } from '../shared/http/ridesErrorMessage';

export const createRidesValidation = (req, res, next) => {
  const startLatitude = Number(req.body.start_lat);
  const startLongitude = Number(req.body.start_long);
  const endLatitude = Number(req.body.end_lat);
  const endLongitude = Number(req.body.end_long);
  const riderName = req.body.rider_name;
  const driverName = req.body.driver_name;
  const driverVehicle = req.body.driver_vehicle;

  if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
    return res.status(HttpStatus.BAD_REQUEST).json(RIDES_VALIDATION_ERROR);
  }

  if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
    return res.status(HttpStatus.BAD_REQUEST).json(RIDES_VALIDATION_ERROR);
  }

  if (typeof riderName !== 'string' || riderName.length < 1) {
    return res.status(HttpStatus.BAD_REQUEST).json(RIDES_VALIDATION_ERROR);
  }

  if (typeof driverName !== 'string' || driverName.length < 1) {
    return res.status(HttpStatus.BAD_REQUEST).json(RIDES_VALIDATION_ERROR);
  }

  if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
    return res.status(HttpStatus.BAD_REQUEST).json(RIDES_VALIDATION_ERROR);
  }

  next();
};
