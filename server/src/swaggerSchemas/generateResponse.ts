export const statusCode: object = {
  200: 'Succeful',
  201: 'Created',
  204: 'Deleted Successfully',
  400: 'Bad Request',
  401: 'Not Authorized',
  404: 'Not Found',
  406: 'Not Acceptable',
  409: 'Conflict',
  500: 'Internal Server Error',
};

export const generateResponseSchema = (
  status: number,
  message: string,
  data?: object,
): object => {
  const isError = status !== 200 && status !== 201 && status !== 204;

  return {
    status,
    description: statusCode[status],
    schema: {
      properties: {
        statusCode: { type: 'number', example: status },
        message: { type: 'string', example: message },
        ...(isError && {
          error: { type: 'string', example: statusCode[status] },
        }),
        ...data,
      },
    },
  };
};
