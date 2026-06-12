import { createClient } from "@nhost/nhost-js"

import { env } from "@/lib/env"

export const nhost = createClient({
  subdomain: env.nhostSubdomain,
  region: env.nhostRegion,
})
