import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Sun, Moon, Book } from 'lucide-react';
import { useThemeMode } from '../../context/ThemeModeContext';

const AppBar = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <MuiAppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          <Book size={32} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Advanced Rig Veda Explorer
        </Typography>
        <IconButton color="inherit" onClick={toggleTheme}>
          {mode === 'dark' ? <Sun /> : <Moon />}
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;