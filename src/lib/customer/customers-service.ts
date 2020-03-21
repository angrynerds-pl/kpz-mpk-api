import { getConnection } from "typeorm";
import { Customer } from "./customer";
import { transform } from "../../helpers/transform";

const customerIdCache = new Map<string, string>();

export async function auth0ToCustomerId(auth0Id: string): Promise<string> {
  const cacheResult = customerIdCache.get(auth0Id);

  if (cacheResult) {
    return cacheResult;
  }

  const customerId = await getConnection().transaction(async conn => {
    const transaction = conn.getRepository(Customer);
    const existingCustomer = await transaction.findOne({ where: { auth0Id } });

    if (existingCustomer) return existingCustomer.id;

    const newCustomer = transform(Customer, { auth0Id });
    await transaction.save(newCustomer);

    return newCustomer.id;
  });

  customerIdCache.set(auth0Id, customerId);

  return customerId;
}
