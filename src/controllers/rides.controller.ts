import { createRides, getAllRides, getRidesById, getRidesWithOffsetLimit } from '../services/rides.service';
import { InternalServerError } from '../shared/http/ErrorMessage';
import { HttpStatus } from '../shared/http/httpStatus';
import { RIDES_NOT_FOUND_ERROR } from '../shared/http/ridesErrorMessage';

export const createRidesHandler = async (req, res, next) => {
  try {
    const rows = await createRides(req);
    return res.status(HttpStatus.CREATED).json(rows);
  } catch (err) {
    next(InternalServerError);
  }
};

export const getRidesHandler = async (req, res, next) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    if (page > 0 && limit > 0) {
      const rows = await getRidesWithOffsetLimit(limit, page);
      if (rows.length !== 0) return res.status(HttpStatus.OK).json(rows);
      return res.status(HttpStatus.NOT_FOUND).json(RIDES_NOT_FOUND_ERROR);
    } else {
      const rows = await getAllRides();
      if (Object.keys(rows).length !== 0) return res.status(HttpStatus.OK).json(rows);
      return res.status(HttpStatus.NOT_FOUND).json(RIDES_NOT_FOUND_ERROR);
    }
  } catch (err) {
    next(InternalServerError);
  }
};

export const getRidesByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rows = await getRidesById(id);
    if (Object.keys(rows).length !== 0) {
      return res.status(HttpStatus.OK).json(rows);
    }
    res.status(HttpStatus.NOT_FOUND).json(RIDES_NOT_FOUND_ERROR);
  } catch (err) {
    next(InternalServerError);
  }
};
