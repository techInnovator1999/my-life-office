import { HttpException, HttpStatus } from '@nestjs/common';

export async function fetchEntity(service, entityName, fields) {
  const entity = await service.findOne(fields);
  if (!entity) {
    throw new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error: `${entityName} not found`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
  return entity;
}
