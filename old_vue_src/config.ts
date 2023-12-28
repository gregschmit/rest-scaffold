// Raw arguments provided in `data-rest-scaffold` as a JSON string.
export type Args = {
  target: string
  apiType?: "rrf" | "drf"
  pkField?: string
  title?: string
  debug?: boolean
  updateSeconds?: number | null

  fields?: object
  listFields?: string[]
  showFields?: string[]
  actionPermissionField?: string
}

// Represents scaffold configuration, which is derived from `Args`, but with tighter contraints,
// default values, and properties hydrated from the API.
export class Config {
  target: string
  apiType?: "rrf" | "drf"
  pkField: string
  title: string
  debug: boolean
  updateSeconds: number | null
  // recordTitle?: string

  fields: object
  listFields: string[]
  showFields: string[]
  actionPermissionField: string

  // disabled_builtin_actions: string[]
  // extra_collection_actions: object
  // extra_member_actions: object

  // TODO: CSRF
  // csrfToken?: string
  // csrfTokenHeader?: string

  constructor(args: Args) {
    let fields: any = Array.isArray(args.fields)
      ? args.fields.reduce((acc, x) => {
          acc[x] = {}
          return acc
        }, {})
      : args.fields || {}

    this.target = args.target.replace(/\/+$/, "")
    this.apiType = args.apiType
    this.pkField = args.pkField || "id"
    this.title = args.title || ""
    this.debug = args.debug || false
    this.updateSeconds = args.updateSeconds === undefined ? 5 : args.updateSeconds

    this.fields = fields
    this.listFields = args.listFields || []
    this.showFields = args.showFields || []
    this.actionPermissionField = args.actionPermissionField || "can_$action?"
  }
}
