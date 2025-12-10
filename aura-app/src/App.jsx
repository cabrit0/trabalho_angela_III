import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import MainLayout from './components/layout/MainLayout';
import Register from './pages/Register';
import Act1 from './pages/Act1';
import Act2 from './pages/Act2';
import Act3 from './pages/Act3';
import Boss from './pages/Boss';
import Report from './pages/Report';


const GameStage = () => {
  const { currentStage } = useGame();

  switch (currentStage) {
    case 'register':
      return <Register />;
    case 'act1':
      return <Act1 />;
    case 'act2':
      return <Act2 />;
    case 'act3':
      return <Act3 />;
    case 'boss':
      return <Boss />;
    case 'report':
      return <Report />;
    default:
      return <Register />;
  }
};

function App() {
  return (
    <GameProvider>
      <MainLayout>
        <GameStage />
      </MainLayout>
    </GameProvider>
  );
}

export default App;
