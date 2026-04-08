import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

export function ConfirmDeleteDialog({
  open,
  taskTitle,
  onClose,
  onConfirm,
  isPending,
}) {
  return (
    <Dialog open={open} onClose={isPending ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete task?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {taskTitle
            ? `This will permanently remove "${taskTitle}" from the board.`
            : 'This will permanently remove the selected task from the board.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={isPending}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
