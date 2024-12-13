import API from "./api"

const DEFAULT_THEME = {
  fontSize: "0.8em",
}

const DEFAULT_LIGHT_THEME = {
  bg: "white",
  fg: "black",
  viewBg: "#d9d9d9",

  tableHeaderBg: "#eee",
  tableBorderH: "#aeaeae",
  tableBorderV: "#d9d9d9",
  tableStripedBg: "#f7f7f7",

  primary: "#0d6efd",
  primaryHover: "#0a58ca",
  danger: "#dc3545",
  dangerHover: "#b02a37",

  infoBg: "#cff4fc",
  infoFg: "#055160",
  successBg: "#a6e0c6",
  successFg: "#024012",
  warningBg: "#fff3cd",
  warningFg: "#664d03",
  errorBg: "#f8d7da",
  errorFg: "#58151c",
}

const DEFAULT_DARK_THEME = {
  bg: "#181818",
  fg: "#f7f7f7",
  viewBg: "#333",

  tableHeaderBg: "#333",
  tableBorderH: "#666",
  tableBorderV: "#333",
  tableStripedBg: "#222",

  primary: "#6ea8fe",
  primaryHover: "#8bb9fe",
  danger: "#ff5b6b",
  dangerHover: "#ff7b89",

  infoBg: "#032830",
  infoFg: "#6edff6",
  successBg: "#0b2e13",
  successFg: "#23d950",
  warningBg: "#332701",
  warningFg: "#ffda6a",
  errorBg: "#2c0b0e",
  errorFg: "#ea868f",
}

class HTMLSafeString extends String {}

// Represents scaffold configuration, which is derived from the JSON string input of the
// `data-rest-scaffold` attribute, but with tighter contraints, default values, and properties
// hydrated from the `OPTIONS` API.
export default class Config {
  target
  query = {}
  apiType
  pkField = "id"
  title = "Records"
  recordTitle = "Record"
  help
  nonFieldErrorsKey = "root"

  inlineEdit = false

  fields
  fieldConfig
  listFields
  showFields
  createFields
  updateFields

  actionPermissionField = "can_$action?"
  canShow = true
  canCreate = true
  canUpdate = true
  canDelete = true
  canRefresh = true

  pagination = {
    params: {
      count: "count",
      page: "page",
      pageSize: "page_size",
      totalPages: "total_pages",
      results: "results",
    },
    pageSize: null,
    window: 1,
    initialPage: null,
  }

  sortable = false
  sortParam = "ordering"
  initialSort

  refresh
  autoRefresh
  autoRefreshSeconds

  theme = { ...DEFAULT_THEME, light: DEFAULT_LIGHT_THEME, dark: DEFAULT_DARK_THEME }

  // disabled_builtin_actions: string[]
  // extra_collection_actions: object
  // extra_member_actions: object

  // TODO: CSRF
  // csrfToken?: string
  // csrfTokenHeader?: string

  api

  isObject(obj) {
    return obj && typeof obj === "object" && !Array.isArray(obj)
  }

  normalizeErrors(errors) {
    if (typeof errors === "string") {
      return errors ? [errors] : true
    } else if (Array.isArray(errors)) {
      return errors.length ? errors : true
    }

    return !!errors
  }

  // Set the properties of an object from a dictionary of arguments, only if the property exists on
  // the object. Recursively set properties of nested objects.
  _assignOpts(object, opts) {
    for (const key in opts) {
      if (object.hasOwnProperty(key)) {
        if (this.isObject(object[key]) && this.isObject(opts[key])) {
          this._assignOpts(object[key], opts[key])
        } else {
          object[key] = opts[key]
        }
      }
    }
  }

  constructor(opts) {
    this._assignOpts(this, opts)

    // Trim query and trailing slash off target URL.
    this.target = this.target.replace(/\?.*/, "").replace(/\/+$/, "")

    // Dynamically populate `fields` and `fieldConfig` if only one is provided.
    if (this.fields && !this.fieldConfig) {
      this.fieldConfig = this.fields.reduce((h, v) => ({ ...h, [v]: {} }), {})
    } else if (this.fieldConfig && !this.fields) {
      this.fields = Object.keys(this.fieldConfig)
    } else if (this.fields && this.fieldConfig) {
      // For each field, add it to the `fieldConfig` if it's not already there.
      for (const field of this.fields) {
        if (!this.fieldConfig[field]) {
          this.fieldConfig[field] = {}
        }
      }
    }

    // Make `pkField` readonly.
    this.fieldConfig[this.pkField] ||= {}
    this.fieldConfig[this.pkField].readonly = true

    // Make `virtual` fields readonly and not sortable.
    for (const field in this.fieldConfig) {
      if (this.fieldConfig[field].type == "virtual") {
        this.fieldConfig[field].readonly = true
        this.fieldConfig[field].sortable = false
      }
    }

    // Dynamically set `listFields`, `showFields`, `createFields`, and `updateFields` if they are
    // not provided.
    if (!this.listFields) {
      this.listFields = this.fields
    }
    if (!this.showFields) {
      this.showFields = this.fields
    }
    if (!this.createFields) {
      this.createFields = this.fields
    }
    if (!this.updateFields) {
      this.updateFields = this.fields
    }

    // Set some reasonable defaults for `fieldConfig`.
    for (const field in this.fieldConfig) {
      const fcfg = this.fieldConfig[field]

      fcfg.label ||= field

      if (this.sortable && fcfg.sortable == null) {
        fcfg.sortable = true
      }
    }

    // Ensure `pagination.pageSize` is an array.
    if (!Array.isArray(this.pagination.pageSize)) {
      this.pagination.pageSize = [this.pagination.pageSize]
    }

    this.api = new API(this)
  }

  // Convert a string to an `HtmlSafeString` object.
  htmlSafe(s) {
    return new HTMLSafeString(s)
  }

  // Escape an unsafe string for rendering as HTML.
  escape(s) {
    if (s instanceof HTMLSafeString) {
      return s
    }

    // Let `innerText` assignment (i.e., the browser) handle escaping.
    let el = document.createElement("span")
    el.innerText = s || ""

    // Lastly, escape quotes:
    return el.innerHTML.replace(/"/g, "&quot;")
  }

  formatBoolean(value, { format } = {}) {
    if (format) {
      const t = format.true || "True"
      const f = format.false || "False"

      if (format.style == "text") {
        return value ? t : f
      } else if (format.style == "badge") {
        return `<span class="rs-badge ${
          value ? "rs-badge-success" : "rs-badge-error"
        }">${value ? t : f}</span>`
      }
    }

    // Default to a checkbox.
    return this.htmlSafe(
      `<input disabled="disabled" type="checkbox" ${value ? "checked" : ""}></input>`,
    )
  }

  formatDate(value, { format } = {}) {
    format ||= this.dateFormat

    return new Date(value).toLocaleDateString(undefined, format || undefined)
  }

  formatTime(value, { format } = {}) {
    format ||= this.timeFormat

    if (format == "zone") {
      return new Date(`2000-01-01T${value}Z`).toLocaleTimeString()
    }

    return new Date(`2000-01-01T${value}`).toLocaleTimeString(undefined, format || undefined)
  }

  formatDateTime(value, { format } = {}) {
    format ||= this.dateTimeFormat

    if (format == "utc") {
      return new Date(value).toUTCString()
    } else if (format) {
      return new Intl.DateTimeFormat(undefined, format).format(value)
    }

    return new Date(value).toLocaleString()
  }

  formatNumber(value, { format } = {}) {
    format ||= this.numberFormat

    if (format) {
      return new Intl.NumberFormat(undefined, format).format(value)
    }

    return Number(value).toLocaleString()
  }

  // Render a record's field according to the field configuration
  _render(field, record) {
    const fcfg = this.fieldConfig[field]

    if (fcfg.render) {
      return this.escape(fcfg.render(record, { config: this }))
    }

    const value = record[field]

    if (fcfg.type == "boolean") {
      return this.formatBoolean(value, { format: fcfg.format })
    } else if (fcfg.type == "date") {
      return this.formatDate(value, { format: fcfg.format })
    } else if (fcfg.type == "time") {
      return this.formatTime(value, { format: fcfg.format })
    } else if (fcfg.type == "datetime") {
      return this.formatDateTime(value, { format: fcfg.format })
    } else if (["number", "integer", "float", "decimal"].includes(fcfg.type)) {
      return this.formatNumber(value, { format: fcfg.format })
    }

    // Implicit `string` type.
    return this.escape(value)
  }

  // Render a record's field for a show (detail) view.
  _renderShow(field, record) {
    const fcfg = this.fieldConfig[field]

    if (fcfg.renderShow) {
      return this.escape(fcfg.renderShow(record, { config: this }))
    } else if (fcfg.render) {
      return this.escape(fcfg.render(record, { config: this }))
    }

    return this._render(field, record)
  }

  // Convert an object to an HTML attributes string.
  toAttributes(obj) {
    return Object.entries(obj)
      .map(([k, v]) => `${k}="${v}"`)
      .join(" ")
  }

  inputLabel(field) {
    const fcfg = this.fieldConfig[field]

    return this.htmlSafe(`<label class="rs-label-prefix" for="${field}">${fcfg.label}</label>`)
  }

  inputWrapper(field, kind, errors, inputBlock) {
    return this.htmlSafe(
      `<div class="rs-form-field rs-form-field-${kind} rs-form-field-f-${field} ${
        errors ? "rs-invalid" : ""
      }">
        ${inputBlock}
        ${
          errors && Array.isArray(errors)
            ? errors.map((e) => `<div class="rs-invalid-text">${this.escape(e)}</div>`).join("")
            : ""
        }
      </div>`,
    )
  }

  inputString(field, { value, errors } = {}) {
    const fcfg = this.fieldConfig[field]

    return this.inputWrapper(
      field,
      "string",
      errors,
      `${this.inputLabel(field)}<input type="text" id="${field}" name="${field}" ${
        value ? `value="${this.escape(value)}"` : ""
      } ${fcfg.inputOptions ? this.toAttributes(fcfg.inputOptions) : ""}>`,
    )
  }

  inputBoolean(field, { value, errors } = {}) {
    const fcfg = this.fieldConfig[field]

    return this.inputWrapper(
      field,
      "boolean",
      errors,
      `<label class="rs-label-postfix"><input type="checkbox" id="${field}" name="${field}" ${
        value ? "checked" : ""
      } ${fcfg.inputOptions ? this.toAttributes(fcfg.inputOptions) : ""}><span>${
        fcfg.label
      }?</span></label>`,
    )
  }

  inputDate(field, { value, errors } = {}) {
    const fcfg = this.fieldConfig[field]

    return this.inputWrapper(
      field,
      "date",
      errors,
      `${this.inputLabel(field)}<input type="date" id="${field}" name="${field}" ${
        value ? `value="${this.escape(value)}"` : ""
      } ${fcfg.inputOptions ? this.toAttributes(fcfg.inputOptions) : ""}>`,
    )
  }

  inputTime(field, { value, errors } = {}) {
    const fcfg = this.fieldConfig[field]

    return this.inputWrapper(
      field,
      "time",
      errors,
      `${this.inputLabel(field)}<input type="time" id="${field}" name="${field}" ${
        value ? `value="${this.escape(value)}"` : ""
      } ${fcfg.inputOptions ? this.toAttributes(fcfg.inputOptions) : ""}>`,
    )
  }

  inputDateTime(field, { value, errors } = {}) {
    const fcfg = this.fieldConfig[field]

    return this.inputWrapper(
      field,
      "datetime",
      errors,
      `${this.inputLabel(field)}<input type="datetime-local" id="${field}" name="${field}" ${
        value ? `value="${this.escape(value)}"` : ""
      } ${fcfg.inputOptions ? this.toAttributes(fcfg.inputOptions) : ""}>`,
    )
  }

  inputNumber(field, { value, errors } = {}) {
    const fcfg = this.fieldConfig[field]

    return this.inputWrapper(
      field,
      "number",
      errors,
      `${this.inputLabel(field)}<input type="number" id="${field}" name="${field}" ${
        value ? `value="${this.escape(value)}"` : ""
      } ${fcfg.inputOptions ? this.toAttributes(fcfg.inputOptions) : ""}>`,
    )
  }

  // Render an HTML input for a record's field, given an optional initial value.
  _renderInput(field, { record, errors } = {}) {
    const fcfg = this.fieldConfig[field]
    const normalizedErrors = this.normalizeErrors(errors)

    if (fcfg.renderInput) {
      return this.escape(fcfg.renderInput({ record, config: this, errors: normalizedErrors }))
    }

    const value = record?.[field]

    if (fcfg.type == "boolean") {
      return this.inputBoolean(field, { value, errors: normalizedErrors })
    } else if (fcfg.type == "date") {
      return this.inputDate(field, { value, errors: normalizedErrors })
    } else if (fcfg.type == "time") {
      return this.inputTime(field, { value, errors: normalizedErrors })
    } else if (fcfg.type == "datetime") {
      return this.inputDateTime(field, { value, errors: normalizedErrors })
    } else if (["number", "integer", "float", "decimal"].includes(fcfg.type)) {
      return this.inputNumber(field, { value, errors: normalizedErrors })
    }

    // Implicit `string` type.
    return this.inputString(field, { value, errors: normalizedErrors })
  }

  getFormJSON(form) {
    const data = Object.fromEntries(new FormData(form).entries())

    // Parse booleans.
    Array.from(form.querySelectorAll('input[type="checkbox"]:not([disabled])')).forEach((el) => {
      data[el.name] = el.checked
    })

    // Parse numbers.
    Array.from(form.querySelectorAll('input[type="number"]:not([disabled])')).forEach((el) => {
      if (el.getAttribute("data-rs-type") === "integer") {
        data[el.name] = parseInt(data[el.name])
      } else if (el.getAttribute("data-rs-type") === "float") {
        data[el.name] = parseFloat(data[el.name])
      } else if (el.getAttribute("data-rs-type") === "decimal") {
        // String is the proper type for decimal numbers.
      } else {
        data[el.name] = Number(data[el.name])
      }
    })

    return data
  }
}
