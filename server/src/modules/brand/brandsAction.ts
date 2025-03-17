import joi from "joi";
import BrandsRepository from "./BrandsRepository";

import type { RequestHandler } from "express";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const brandList = await BrandsRepository.readAll();

    res.status(200).json(brandList);
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const newVehicle = req.body;
    const insertId = await BrandsRepository.create(newVehicle);

    res.status(201).json(insertId);
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const vehicle = req.body;
    await BrandsRepository.deleteVehicle(vehicle);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const newVehicleSchema = joi.object({
  brand: joi.string().min(3).max(50).allow(null).required(),
  model: joi.string().min(2).max(50).allow(null).required(),
  socket: joi.string().min(3).max(20).allow(null).required(),
  id_brand: joi.number().integer().required(),
  id_model: joi.number().integer().required(),
  id_socket: joi.number().integer().required(),
});

const validate: RequestHandler = (req, res, next) => {
  const { error } = newVehicleSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const validationErrors = error?.details.map((err) => err.message);
    res.sendStatus(400).json({ validationErrors });
  }
  next();
};

export default { browse, add, validate, destroy };
