export const GetCartResponseSchema = {
  data: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 3657 },
        quantity: { type: 'number', example: 3 },
        good: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 22 },
            name: { type: 'string', example: 'Some good name' },
            price: { type: 'number', example: 222.2 },
            image: { type: 'string', example: '/somepath/someimg.jpg' },
          },
        },
      },
    },
  },
};

export const GetAllGoodsResponseSchema = {
  data: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 367 },
        name: { type: 'string', example: 'Some good name' },
        price: { type: 'number', example: 222.2 },
        image: { type: 'string', example: '/somepath/someimg.jpg' },
        manufacture: { type: 'string', example: 'Some manufacture name' },
        appoint: { type: 'string', example: 'Some appoint name' },
        tag: {
          type: 'array',
          items: {
            exaple: 'some tag',
          },
        },
      },
    },
  },
  total: { type: 'number', example: 1 },
};

export const CreateOrderResponseSchema = {
  data: {
    type: 'object',
    properties: {
      orderId: { type: 'number', example: 543 },
    },
  },
};

export const GetAllOrdersByUserResponseSChema = {
  data: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 367 },
        status: { type: 'string', example: 'pending' },
        createdAt: { type: 'string', example: '2024-04-04T13:18:12.880Z' },
        updatetAt: { type: 'string', example: '2024-04-04T13:18:12.880Z' },
        orderItems: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 37 },
              name: { type: 'string', example: 'Some good name' },
              price: { type: 'number', example: 222.2 },
              image: { type: 'string', example: '/somepath/someimg.jpg' },
              quantity: { type: 'number', example: 7 },
            },
          },
        },
      },
    },
  },
};

export const SigUpResponseSchema = {
  data: {
    type: 'object',
    properties: {
      email: { type: 'string', example: 'example@gmail.com' },
      access_token: {
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ijc3cGRhYnVkQGdtYWlsLmNvbSIsImlkIjoxOSwiaWF0IjoxNzEyMjQ4NjIzLCJleHAiOjE3MTIzMzE0MjN9.huA3adRMHw11zcJ0lnu5FutzxmmwEO4mqZSb3Zh0vfo',
      },
      socketId: { type: 'string', example: 'SAd34das@1wadas' },
      id: { type: 'number', example: 19 },
      createdAt: { type: 'string', example: '2024-04-04T13:18:12.880Z' },
      updatetAt: { type: 'string', example: '2024-04-04T13:18:12.880Z' },
    },
  },
};

export const SignInClientResponseSchema = {
  data: {
    type: 'object',
    properties: {
      email: { type: 'string', example: 'example@gmail.com' },
      access_token: {
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ijc3cGRhYnVkQGdtYWlsLmNvbSIsImlkIjoxOSwiaWF0IjoxNzEyMjQ4NjIzLCJleHAiOjE3MTIzMzE0MjN9.huA3adRMHw11zcJ0lnu5FutzxmmwEO4mqZSb3Zh0vfo',
      },
      socketId: { type: 'string', example: 'SAd34das@1wadas' },
    },
  },
};

export const GetMeResponseSchema = {
  data: {
    type: 'object',
    properties: {
      email: { type: 'string', example: 'example@gmail.com' },
      socketId: { type: 'string', example: 'SAd34das@1wadas' },
      access_token: {
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ijc3cGRhYnVkQGdtYWlsLmNvbSIsImlkIjoxOSwiaWF0IjoxNzEyMjQ4NjIzLCJleHAiOjE3MTIzMzE0MjN9.huA3adRMHw11zcJ0lnu5FutzxmmwEO4mqZSb3Zh0vfo',
      },
    },
  },
};
