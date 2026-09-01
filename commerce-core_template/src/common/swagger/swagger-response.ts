import { applyDecorators } from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function SwaggerSuccess(example: any) {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        example,
      },
    }),
  );
}

export function SwaggerCreated(example: any) {
  return applyDecorators(
    ApiCreatedResponse({
      schema: {
        example,
      },
    }),
  );
}

export function SwaggerBadRequest(message = 'Bad Request') {
  return applyDecorators(
    ApiBadRequestResponse({
      schema: {
        example: {
          success: false,
          statusCode: 400,
          message,
        },
      },
    }),
  );
}

export function SwaggerUnauthorized(message = 'Unauthorized') {
  return applyDecorators(
    ApiUnauthorizedResponse({
      schema: {
        example: {
          success: false,
          statusCode: 401,
          message,
        },
      },
    }),
  );
}

export function SwaggerForbidden(message = 'Forbidden') {
  return applyDecorators(
    ApiForbiddenResponse({
      schema: {
        example: {
          success: false,
          statusCode: 403,
          message,
        },
      },
    }),
  );
}

export function SwaggerNotFound(message = 'Resource not found') {
  return applyDecorators(
    ApiNotFoundResponse({
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message,
        },
      },
    }),
  );
}

export function SwaggerConflict(message = 'Conflict') {
  return applyDecorators(
    ApiConflictResponse({
      schema: {
        example: {
          success: false,
          statusCode: 409,
          message,
        },
      },
    }),
  );
}

export function SwaggerInternalServerError(message = 'Internal Server Error') {
  return applyDecorators(
    ApiInternalServerErrorResponse({
      schema: {
        example: {
          success: false,
          statusCode: 500,
          message,
        },
      },
    }),
  );
}
