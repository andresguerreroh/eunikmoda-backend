import { tagRepository } from "../repositories/tag.repository";

export const tagService = {
  listarPublicas() {
    return tagRepository.findAll();
  },
};
