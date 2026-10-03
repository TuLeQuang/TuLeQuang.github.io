import { resumeData } from '@/data/resume'
import type { CompanyId, Customer, CustomerId, Project } from '@/types'

const byId = new Map<CustomerId, Customer>(resumeData.customers.map(c => [c.id, c]))

export const customerById = (id: CustomerId): Customer => {
  const customer = byId.get(id)
  if (!customer) throw new Error(`Unknown customer: ${id}`)
  return customer
}

export const customerOf = (project: Project): Customer => customerById(project.customer)

/** Key clients of an employer (e.g. CMC Global → Samsung). */
export const keyClientsOf = (company: CompanyId): Customer[] =>
  resumeData.customers.filter(c => c.company === company && c.keyClient)
