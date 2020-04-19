import {KeyboardKey} from "../const.js";

export const checkIsEscKey = ({key}) => {
  return key === KeyboardKey.ESCAPE || key === KeyboardKey.ESC;
};
