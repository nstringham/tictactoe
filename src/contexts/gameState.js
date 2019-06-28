import { createContext } from 'react';
import { checkResult } from '../libs/helpers';

export const GAME_STATE = {
  IDLE: 'IDLE',
  YOUR_TOURN: 'YOUR_TURN',
  OPPONENTS_TURN: 'OPPONENTS_TURN',
  WIN: 'WIN',
  DEFEAT: 'DEFEAT',
  DRAW: 'DRAW',
};

export const GAME_STATE_ACTION_TYPE = {
  CHECK: 'CHECK',
  RESET: 'RESET',
  RESET_SCORE: 'RESET_SCORE',
};

export const defaultValue = {
  score: {
    you: 0,
    opponent: 0,
  },
  round: 0,
  board: {
    a1: null, b1: null, c1: null,
    a2: null, b2: null, c2: null,
    a3: null, b3: null, c3: null,
  },
  state: GAME_STATE.IDLE,
};

export const dispatcher = (state, action) => {
  switch (action.type) {

    case GAME_STATE_ACTION_TYPE.CHECK:
    {
    // Validate payload
    // Scheme { target: String, value: String }
    if (!action.payload) throw new Error('payload is required');
    if (Object.keys(defaultValue.board).indexOf(action.payload.target) === -1) throw new Error('payload.target has unexpected value');
    if (['x', 'o'].indexOf(action.payload.value) === -1) throw new Error('payload.value is invalid. It expects `x` or `o`');
    if (state.board[action.payload.cellName] !== null) throw new Error('target is not empty');
    
      const newState = {...state};
      newState.board[action.payload.target] = action.payload.value;
      newState.round += 1;

      const result = checkResult(newState.board);
      const won = result && result.winner === 'o';
      const lost = result && result.winner === 'x';
      const draw = !result && newState.round === 9;

      if (won) {
        newState.score.you += 1;
        newState.state = GAME_STATE.WIN;
      }

      if (lost) {
        newState.score.opponent += 1;
        newState.state = GAME_STATE.DEFEAT;
      }

      if (draw) newState.state = GAME_STATE.DRAW;

      return newState;
    }

    case GAME_STATE_ACTION_TYPE.RESET:
    {
      const newState = {...state};
      newState.round = 0;
      newState.board = defaultValue.board;
      newState.state = GAME_STATE.IDLE;
      return newState;
    }

    case GAME_STATE_ACTION_TYPE.RESET_SCORE:
    {
      const newState = {...state};
      newState.score = defaultValue.score;
      return newState;
    }

    default:
      return state;
  }
}

export default createContext();
