import { Repository, getRepository } from "typeorm";
import { badImplementation } from "@hapi/boom";
import { Customer } from "./custoner";

function repo(): Repository<Customer> {
  return getRepository(Customer);
}

const customerIdCache = new Map<string, string>();

export async function auth0ToCustomerId(auth0Id: string): Promise<string> {
  const cacheResult = customerIdCache.get(auth0Id);

  if (cacheResult) {
    return cacheResult;
  }

  const result = await repo()
    .createQueryBuilder()
    .insert()
    .values({ auth0Id })
    // it has to be DO UPDATE instead DO NOTHING because postgres
    // won't return id in that case
    .onConflict("(auth0_id) DO UPDATE SET auth0_id = excluded.auth0_id")
    .returning(["id"])
    .execute();

  if (result.generatedMaps.length !== 1) {
    throw badImplementation();
  }

  const customerId = result.generatedMaps[0].id;

  customerIdCache.set(auth0Id, customerId);

  return customerId;
}
