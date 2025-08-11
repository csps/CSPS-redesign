import { Box, TextField, type TextFieldProps } from "@mui/material";

type GlassTextFieldProps = TextFieldProps & {
  containerClassName?: string;
  blur?: number;
  borderRadius?: number | string;
};

export function GlassTextField({
  containerClassName = "",
  blur = 4,
  borderRadius = 20,
  sx,
  ...props
}: GlassTextFieldProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        borderRadius,
        p: 1.5,
        overflow: "hidden",
      }}
      className={`glass-card group ${containerClassName}`}
    >
      {/* Glassmorphism background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius,
          backdropFilter: `blur(${blur}px)`,
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: 3,
        }}
      />

      {/* Content layer */}
      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          {...props}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "transparent",
              borderRadius: "12px",
              backdropFilter: `blur(${blur}px)`,
              "& fieldset": { border: "none" },
              "&:hover fieldset": { border: "none" },
              "&.Mui-focused fieldset": { border: "none" },
              "& input:-webkit-autofill": {
                boxShadow: "0 0 0 1000px transparent inset",
                WebkitTextFillColor: "white",
                transition: "background-color 5000s ease-in-out 0s",
              },
            },
            "& .MuiInputBase-input": {
              color: "white",
              backgroundColor: "transparent",
            },
            "& .MuiInputLabel-root": {
              color: "rgba(255,255,255,0.6)",
            },
            ...sx,
          }}
        />
      </Box>
    </Box>
  );
}
