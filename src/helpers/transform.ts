import { plainToClass } from "class-transformer";

export function transform<Entity, Plain>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cls: new (...args: any[]) => Entity,
  plain: Plain
): Entity {
  return plainToClass(cls, plain, { excludeExtraneousValues: true });
}
