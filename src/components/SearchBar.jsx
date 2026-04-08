import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { InputAdornment, TextField } from '@mui/material'

export function SearchBar({ value, onChange }) {
  return (
    <TextField
      fullWidth
      placeholder="Search by title or description"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchRoundedIcon sx={{ color: '#9ca3af', fontSize: 18 }} />
          </InputAdornment>
        ),
        sx: {
          height: 38,
          borderRadius: '8px',
          fontSize: 13,
          backgroundColor: '#f3f4f8',
          '& input::placeholder': {
            opacity: 1,
            color: '#8a91a3',
          },
        },
      }}
      sx={{
        maxWidth: { md: 206 },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#e5e7ef',
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#d9ddea',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#c9d0e3',
          borderWidth: 1,
        },
      }}
    />
  )
}
