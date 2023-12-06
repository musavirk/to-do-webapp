export const handleErrorResponse = (res, status, message, error = null) => {
  if (error) {
    console.log(error?.message || error);
  }
  return res.status(status).json({ error: message, data: null });
};

export const handleSuccessResponse = (res, data) => res.status(200).json({ error: null, data });
