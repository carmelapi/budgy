import { createTheme } from '@mui/material/styles';

export const iosTheme = createTheme({
  palette: {
    primary: {
      main: '#007AFF',
      light: '#5AC8FA',
      dark: '#0051D5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF9500',
      light: '#FFCC00',
      dark: '#FF6500',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#34C759',
      light: '#30D158',
      dark: '#248A3D',
    },
    error: {
      main: '#FF3B30',
      light: '#FF453A',
      dark: '#D70015',
    },
    warning: {
      main: '#FF9500',
      light: '#FF9F0A',
      dark: '#C93400',
    },
    info: {
      main: '#5AC8FA',
      light: '#64D2FF',
      dark: '#0A84FF',
    },
    background: {
      default: '#F2F2F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#3C3C43',
      disabled: '#8E8E93',
    },
    divider: '#C6C6C8',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '34px',
      fontWeight: 700,
      letterSpacing: '0.374px',
    },
    h2: {
      fontSize: '28px',
      fontWeight: 700,
      letterSpacing: '0.364px',
    },
    h3: {
      fontSize: '22px',
      fontWeight: 600,
      letterSpacing: '0.352px',
    },
    h4: {
      fontSize: '20px',
      fontWeight: 600,
      letterSpacing: '0.38px',
    },
    h5: {
      fontSize: '17px',
      fontWeight: 600,
      letterSpacing: '-0.408px',
    },
    h6: {
      fontSize: '15px',
      fontWeight: 600,
      letterSpacing: '-0.24px',
    },
    body1: {
      fontSize: '17px',
      fontWeight: 400,
      letterSpacing: '-0.408px',
    },
    body2: {
      fontSize: '15px',
      fontWeight: 400,
      letterSpacing: '-0.24px',
    },
    button: {
      fontSize: '17px',
      fontWeight: 600,
      letterSpacing: '-0.408px',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.04)',
    '0px 2px 6px rgba(0, 0, 0, 0.06)',
    '0px 4px 12px rgba(0, 0, 0, 0.08)',
    '0px 6px 16px rgba(0, 0, 0, 0.10)',
    '0px 8px 20px rgba(0, 0, 0, 0.12)',
    '0px 10px 24px rgba(0, 0, 0, 0.14)',
    '0px 12px 28px rgba(0, 0, 0, 0.16)',
    '0px 14px 32px rgba(0, 0, 0, 0.18)',
    '0px 16px 36px rgba(0, 0, 0, 0.20)',
    '0px 18px 40px rgba(0, 0, 0, 0.22)',
    '0px 20px 44px rgba(0, 0, 0, 0.24)',
    '0px 22px 48px rgba(0, 0, 0, 0.26)',
    '0px 24px 52px rgba(0, 0, 0, 0.28)',
    '0px 26px 56px rgba(0, 0, 0, 0.30)',
    '0px 28px 60px rgba(0, 0, 0, 0.32)',
    '0px 30px 64px rgba(0, 0, 0, 0.34)',
    '0px 32px 68px rgba(0, 0, 0, 0.36)',
    '0px 34px 72px rgba(0, 0, 0, 0.38)',
    '0px 36px 76px rgba(0, 0, 0, 0.40)',
    '0px 38px 80px rgba(0, 0, 0, 0.42)',
    '0px 40px 84px rgba(0, 0, 0, 0.44)',
    '0px 42px 88px rgba(0, 0, 0, 0.46)',
    '0px 44px 92px rgba(0, 0, 0, 0.48)',
    '0px 46px 96px rgba(0, 0, 0, 0.50)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '12px 24px',
          fontSize: '17px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            transform: 'scale(0.98)',
            transition: 'transform 0.1s ease',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
            backgroundColor: 'rgba(0, 122, 255, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            backgroundColor: '#F2F2F7',
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: '#007AFF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#007AFF',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E5E5EA',
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          fontSize: '15px',
          color: '#3C3C43',
          backgroundColor: '#F2F2F7',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '16px',
          padding: '4px',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '20px',
          fontWeight: 600,
          padding: '20px 24px 12px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '12px 24px 20px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 20px',
        },
      },
    },
  },
});
