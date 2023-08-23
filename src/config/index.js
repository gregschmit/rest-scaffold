import API from "./api"

const DEFAULT_PAGINATION_PARAMS = {
  count: "count",
  page: "page",
  pageSize: "page_size",
  totalPages: "total_pages",
  results: "results",
}

// Represents scaffold configuration, which is derived from the JSON string input of the
// `data-rest-scaffold` attribute, but with tighter contraints, default values, and properties
// hydrated from the API.
export default class Config {
  target
  apiType
  pkField
  title
  recordTitle

  fields
  fieldConfig
  actionPermissionField

  paginationParams

  debug
  updateSeconds

  // disabled_builtin_actions: string[]
  // extra_collection_actions: object
  // extra_member_actions: object

  // TODO: CSRF
  // csrfToken?: string
  // csrfTokenHeader?: string

  api
  initializationError

  constructor(args) {
    // Trim trailing slash off target URL.
    this.target = args.target.replace(/\/+$/, "")

    this.apiType = args.apiType
    this.pkField = args.pkField || "id"
    this.title = args.title || "Records"
    this.recordTitle = args.recordTitle || "Record"

    this.fields = args.fields
    this.fieldConfig = args.fieldConfig
    if (this.fields && !this.fieldConfig) {
      this.fieldConfig = this.fields.reduce((h, v) => ({ ...h, [v]: {} }), {})
    } else if (this.fieldConfig && !this.fields) {
      this.fields = Object.keys(args.fieldConfig)
    }

    this.actionPermissionField = args.actionPermissionField || "can_$action?"

    this.paginationParams = { ...DEFAULT_PAGINATION_PARAMS, ...args.paginationParams }

    this.debug = args.debug || false
    this.updateSeconds = args.updateSeconds === undefined ? 5 : args.updateSeconds

    this.api = new API(this)
  }

  initialize() {
    if (!this.fields) {
      this.initializationError = "No fields configured"
      return false
    }

    return this.api.initialize()
  }
}
