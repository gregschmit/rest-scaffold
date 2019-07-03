# REST-Scaffold.js

`rest-scaffold.js` is a JavaScript library for building scaffolds (tables +
actions) that represent objects which are exposed by a RESTful API.

## How It Works

The basic idea is that you have some API at `https://example.com/api/thing` and
you provide a `div` with a `data-rest-scaffold` property which is a
configuration in the form of a JSON, like:

```json
{
  "title": "Things",
  "subtitle": "that go in the kitchen",
  "recordTitle": "Thing",
  "pkField": "id",
  "url": "https://example.com/api/thing",
  "csrfToken": "blahblah"
}
```

If you're using a tool like `django-rest-scaffold` to generate all this, then
the tool can escape the quotes in the JSON. Otherwise, using single quotes for
the property is helpful.

The `div` would look like this:

```html
<div data-rest-scaffold='{"title": "Things","subtitle": "that go in the kitchen"
,"recordTitle": "Thing","pkField": "id","url": "https://example.com/api/thing",
"csrfToken": "blahblah"}'></div>
```

The library will assume the following endpoints exist:
- `GET`->`thing` A listing of the objects
- `POST`->`thing` A creation of a single object
- `GET`->`thing/pk` A retrieval of a single object
- `POST`->`thing/pk` A update of a single object

The latest version should be available at:
- https://cdn.jsdelivr.net/gh/gregschmit/rest-scaffold@master/rest-scaffold.js
- https://cdn.jsdelivr.net/gh/gregschmit/rest-scaffold@master/rest-scaffold.css

## To Do

- Make the endpoints configurable rather than workable only with Django.
- FK Mappings to better show foreignkey fields the verbose names in the listing
  - Configurable for list to be comma/separated or lf-separated
- Add detail view
- Sorting (both from the server and client side)
- Make pagination details configurable
- Better documentation on the configuration options
- Multi-select with multi-delete, bulk-edit?
- expand scaffold option to see a larger data set
