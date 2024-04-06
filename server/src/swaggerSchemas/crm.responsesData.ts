export const GetAllArrayTypeResponseSchema = {
  data: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'example' },
      },
    },
  },
  total: { type: 'number', example: 1 },
};

export const GetAllGoodsResponseSchema = {
  data: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 38 },
        name: { type: 'string', example: 'test2' },
        price: { type: 'number', example: 0.4 },
        image: { type: 'string', example: '/upload/hero-bg.jpg' },
        manufacture: { type: 'object' },
        appoint: { type: 'object' },
        tags: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  },
  total: { type: 'number', example: 1 },
};

export const CrmLoginResponseSchema = {
  data: {
    type: 'object',
    properties: {
      email: { type: 'string', example: 'example@example.com' },
      jwt: {
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoidGVzdEB0ZXN0LnRlc3QiLCJpYXQiOjE3MTIxNTE1NTcsImV4cCI6MTcxMjE4MDM1N30.i8VHX_uaeXy3K1_eU_XgslzVjIOP5aQrl9UR1AWF76U',
      },
      role: { type: 'string', example: 'manager' },
    },
  },
};

export const GetAllOrdersResponseSchema = {
  data: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 38 },
        status: { type: 'string', example: 'done' },
        createdAt: { type: 'string', example: '2024-03-25T11:10:01.022Z' },
        updatetAt: { type: 'string', example: '2024-03-25T11:10:25.083Z' },
        orderItems: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 38 },
            quantity: { type: 'number', example: 38 },
            name: { type: 'string', example: 'some good' },
            price: { type: 'number', example: 385 },
            image: { type: 'string', example: '/somepath/somefile.jpg' },
          },
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 358 },
            email: { type: 'string', example: 'example@example.example' },
          },
        },
      },
    },
  },
  total: { type: 'number', example: 1 },
};

export const GetAllManagersResponseSchema = {
  data: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 358 },
        email: { type: 'string', example: 'example@example.example' },
        role: { type: 'string', example: 'manager' },
      },
    },
  },
};

export const GetAllLogsResponseSchema = {
  data: {
    type: 'object',
    properties: {
      logs: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            _id: { type: 'object.id', example: '66042f7f99531868bf600449' },
            userId: { type: 'number', example: 13 },
            role: { type: 'string', example: 'manager' },
            action: { type: 'string', example: 'create' },
            resource: { type: 'string', example: 'good' },
            createdAt: { type: 'string', example: '2024-03-27T14:38:55.866Z' },
          },
        },
      },
      total: { type: 'number', example: 1 },
    },
  },
};
