import {KeyboardKey} from "../const.js";

export const isEscKey = ({key}) => {
  return key === KeyboardKey.ESCAPE || key === KeyboardKey.ESC;
};
