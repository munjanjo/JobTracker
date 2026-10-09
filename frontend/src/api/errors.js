export function getErrorMessages(err) {
  const errors = err.response?.data?.errors;
  if (errors) return Object.values(errors).flat();
  if (err.response?.status === 401)
    return ["Sesija je istekla, prijavi se ponovno."];
  return ["Nešto je pošlo po zlu."];
}
