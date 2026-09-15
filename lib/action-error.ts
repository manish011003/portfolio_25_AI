export function actionError(error: unknown, fallback = "Something went wrong. Try again.") {
  if (error instanceof Error && error.name === "UnauthorizedError") {
    return { error: "Session expired. Refresh and log in again." };
  }
  console.error(error);
  return { error: fallback };
}
