async function withRetries(fn, params, maxAttempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn(params);
    } catch (err) {
      lastError = err;
      await new Promise(res => setTimeout(res, 200 * attempt));
    }
  }
  return { status: "error", message: lastError?.message || "Unknown error" };
}

export default withRetries