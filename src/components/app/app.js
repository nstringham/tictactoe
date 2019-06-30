import React, { useState, useEffect, useReducer } from 'react';
import DarkThemeContext from '../../contexts/darkTheme';
import GameStateContext, {
  dispatcher as gameStateDispatcher,
  defaultValue as gameStateDefaultValue,
} from '../../contexts/gameState';
import Button from '../button/button';
import Icon from '../icon/icon';
import Menu from '../menu/menu';
import './app.css';

function App() {
  const [darkTheme, setDarkTheme] = useState(false);
  const [menu, setMenu] = useState(false);
  const [noOutlines, setNoOutlines] = useState(false);
  const [gameState, dispatchGameState] = useReducer(gameStateDispatcher, gameStateDefaultValue);

  function closeMenu() {
    setMenu(false);
    document.querySelector('.app__menu-button button').focus();
  }

  useEffect(() => {
    function enableOutlines() {
      if (noOutlines === false) return;
      setNoOutlines(false);
    }

    function disableOutlines() {
      if (noOutlines === true) return;
      setNoOutlines(true);
    }

    function onTabPress(evt) {
      if (evt.key !== 'Tab') return;
      enableOutlines();
    }

    window.addEventListener('mousemove', disableOutlines);
    window.addEventListener('touchstart', disableOutlines);
    window.addEventListener('keydown', onTabPress);
    return () => {
      window.removeEventListener('mousemove', disableOutlines);
      window.removeEventListener('touchstart', disableOutlines);
      window.removeEventListener('keydown', onTabPress);
    };
  }, [noOutlines]);

  window.t = () => setDarkTheme(!darkTheme);

  return (
    <DarkThemeContext.Provider value={[darkTheme, setDarkTheme]}>
      <GameStateContext.Provider value={[gameState, dispatchGameState]}>
        <div className={'app animated zoomIn fast ' +
          (darkTheme ? 'app--dark-theme ' : '') +
          (noOutlines ? 'app--no-outlines ' : '')
        }>
          {menu
            ? <Menu
                onClose={closeMenu}
                darkTheme={darkTheme}
                toggleDarkTheme={() => setDarkTheme(!darkTheme)}
              />
            : null}
          <div className="app__menu-button">
            <Button
              onClick={() => setMenu(true)}
              aria-label="Open menu"
            >
              <Icon
                type="menu"
                aria-hidden
                size={20}
              />
            </Button>
          </div>
        </div>
      </GameStateContext.Provider>
    </DarkThemeContext.Provider>
  );
}

export default App;
