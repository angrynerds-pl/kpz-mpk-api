import { plainToClass } from "class-transformer";

export function transform<Entity, Plain>(
  cls: new (...args: any[]) => Entity,
  plain: Plain
): Entity {
  return plainToClass(cls, plain, { excludeExtraneousValues: true });
}
