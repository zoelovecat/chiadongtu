interface FormHintIconProps {
  hint: string
}

export function FormHintIcon({ hint }: FormHintIconProps) {
  return (
    <span className="form-hint">
      <button
        type="button"
        className="form-hint-trigger"
        aria-label="Xem gợi ý chia thể"
        onClick={(e) => e.preventDefault()}
      >
        ?
      </button>
      <span className="form-hint-tooltip" role="tooltip">
        {hint}
      </span>
    </span>
  )
}
