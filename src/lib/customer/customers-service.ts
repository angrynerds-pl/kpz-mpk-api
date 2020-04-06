import { getRepository, Repository } from "typeorm";
import { Customer } from "./customer";
import { transform } from "../../helpers/transform";

function repo(): Repository<Customer> {
  return getRepository(Customer);
}

const customerIdCache = new Map<string, bigint>();

export async function auth0ToCustomerId(auth0Id: string): Promise<bigint> {
  const cacheResult = customerIdCache.get(auth0Id);

  if (cacheResult) {
    return cacheResult;
  }

  const customer =
    (await repo().findOne({ auth0Id })) || (await createCustomer({ auth0Id }));

  customerIdCache.set(auth0Id, customer.id);

  return customer.id;
}

export async function createCustomer(
  params: Partial<Customer>
): Promise<Customer> {
  const customer = transform(Customer, params);
  await repo().save(customer);
  return customer;
}
