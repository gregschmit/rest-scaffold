export type InputConfig = {
  target: string
  apiType: "rrf" | "plain"
  debug?: boolean
  title?: string
  subtitle?: string

  fields?: any

  action_permission_field?: string
}

export class Config {
  target: string
  apiType: "rrf" | "plain"
  debug: boolean
  title: string
  subtitle: string
  // debug: boolean
  // pkField: string
  // recordTitle?: string

  fields: object

  action_permission_field: string

  // disabled_builtin_actions: string[]
  // extra_collection_actions: object
  // extra_member_actions: object

  // TODO: CSRF
  // csrfToken?: string
  // csrfTokenHeader?: string

  constructor(input_config: InputConfig) {
    // Ensure the target has no trailing slashes.
    this.target = input_config.target.replace(/\/+$/, "")
    switch (input_config.apiType) {
      case "rrf": {
        this.apiType = "rrf"
        break
      }
      default:
        this.apiType = "plain"
    }
    this.debug = input_config.debug || false
    this.title = input_config.title || ""
    this.subtitle = input_config.subtitle || ""
    this.fields = input_config.fields || {}
    this.action_permission_field = input_config.action_permission_field || "can_$action?"
  }

  toObject() {
    return Object.assign({}, this) as any
  }
}
