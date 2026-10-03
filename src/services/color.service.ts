import { colorRepository } from "../repositories/color.repository";

export const colorService = {
  listarPublicas() {
    return colorRepository.findAll();
  },
};
