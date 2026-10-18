import { createTheme } from '@mui/material/styles';

const surfaceShadow = '0 2px 6px rgba(28, 28, 30, 0.025), 0 12px 32px rgba(28, 28, 30, 0.035)';

export const theme = createTheme({
  palette: {
    primary: { main: '#007aff', dark: '#0062cc' },
    success: { main: '#248a3d' },
    error: { main: '#d70015' },
    background: { default: '#f2f2f7', paper: '#ffffff' },
    text: { primary: '#1c1c1e', secondary: '#6c6c70' },
    divider: 'rgba(60, 60, 67, 0.10)',
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 650, letterSpacing: '-0.025em' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: 20 },
        elevation1: { boxShadow: surfaceShadow, border: '1px solid rgba(60, 60, 67, 0.06)' },
      },
    },
    MuiTableContainer: {
      styleOverrides: { root: { borderRadius: 20, boxShadow: surfaceShadow, overflowX: 'auto' } },
    },
    MuiTable: { styleOverrides: { root: { minWidth: 560 } } },
    MuiTableCell: {
      styleOverrides: {
        root: { padding: '18px 24px', borderColor: 'rgba(60, 60, 67, 0.09)', fontVariantNumeric: 'tabular-nums' },
        head: { backgroundColor: '#fafafc', color: '#6c6c70', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' },
        body: { fontSize: 14, letterSpacing: '-0.015em' },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': { borderBottom: 0 },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 12, padding: '9px 18px', minHeight: 40 },
        outlined: { backgroundColor: '#f0f5ff', borderColor: 'transparent', '&:hover': { borderColor: 'transparent', backgroundColor: '#e5efff' } },
        outlinedError: { backgroundColor: '#fff0f0', '&:hover': { backgroundColor: '#ffe5e5' } },
      },
    },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 26, boxShadow: '0 24px 100px rgba(0, 0, 0, 0.16)', border: '1px solid rgba(255, 255, 255, 0.7)' } } },
    MuiBackdrop: { styleOverrides: { root: { backgroundColor: 'rgba(28, 28, 30, 0.24)', backdropFilter: 'blur(6px)' } } },
    MuiDialogTitle: { styleOverrides: { root: { padding: '26px 26px 18px', fontSize: 22, fontWeight: 650, letterSpacing: '-0.03em' } } },
    MuiDialogContent: { styleOverrides: { root: { padding: '12px 26px 24px' } } },
    MuiDialogActions: { styleOverrides: { root: { padding: '16px 26px 22px', gap: 6, borderTop: '1px solid rgba(60, 60, 67, 0.08)' } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 12, backgroundColor: '#fafafc', '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#b8b8c0' } },
        notchedOutline: { borderColor: '#dedee5' },
      },
    },
    MuiInput: { styleOverrides: { root: { backgroundColor: '#f2f2f7', borderRadius: 10, padding: '8px 12px', '&::before, &::after': { display: 'none' } } } },
    MuiFormLabel: { styleOverrides: { root: { fontSize: 14, marginBottom: 6 } } },
    MuiMenuItem: { styleOverrides: { root: { borderRadius: 8, margin: '2px 6px', fontSize: 14 } } },
    MuiAlert: { styleOverrides: { root: { borderRadius: 14 } } },
  },
});
