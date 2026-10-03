import { coleccionRepository } from "../repositories/coleccion.repository";

export const coleccionService = {
  listarPublicas() {
    return coleccionRepository.findAllActive();
  },
};
