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
<div data-rest-scaffold='{
  "title": "Things",
  "subtitle": "that go in the kitchen",
  "recordTitle": "Thing",
  "pkField": "id",
  "url": "https://example.com/api/thing",
  "csrfToken": "blahblah"
}'></div>
```

The library will assume the following endpoints exist:
- `GET`->`thing` A listing of the objects
- `POST`->`thing` A creation of a single object
- `GET`->`thing/pk` A retrieval of a single object
- `PUT`->`thing/pk` A update of a single object
- `DELETE`->`thing/pk` A deletion of a single object

## CDN Links

https://cdn.jsdelivr.net/npm/rest-scaffold/dist/rest-scaffold.js
https://cdn.jsdelivr.net/npm/rest-scaffold/dist/rest-scaffold.css

## Configuration Options

### Common Options

`title` (string, default: `""`): The main bold text shown at the top of the
scaffold.

`subtitle` (string, default: `""`): Lighter text shown after the title at the
top of the scaffold.

`url` (string, default: `"/"`): The url that we should use to access the REST
API.

`csrfToken` (string, default: `""`): Cross-Site Request Forgery token to use
during `POST`/`PUT` requests.

`debug` (boolean, default: `true`): Whether debugging information (including
request payload) should be displayed in scaffold error messages.

`fields` (array, default: `[]`): The fields that we should expect. If this is
falsy, then the scaffold will try to infer them from a listing.

`pkField` (string, default: `"id"`): The field that we can use as a primary
key.

### Other Options

`actionsLabel` (string, default: `"."`): The label for the actions column in
the scaffold.

`csrfTokenHeader` (string, default: `"X-CSRFToken"`): The HTTP header for
passing the CSRF Token.

`rawCreateForm` (string, default: `null`): The HTML create form.

`rawUpdateForm` (string, default: `null`): The HTML update form.

`recordTitle` (string, default: `"Record"`): The name for a single record.

## To Do

- convert jQuery stuff to vanilla javascript
- I'm a C programmer, so some style issues could be fixed:
    - for loops don't have `i` initialized inside them, and the spacing is
      C-like
- Make the endpoints configurable rather than workable only with Django (methods/verbs/etc).
- FK Mappings to better show foreignkey fields the verbose names in the listing
  - Configurable for list to be comma/separated or lf-separated
  - Also, not even foreign key but just fields that map to choices in a select
    field
- Add detail view
- Sorting (both from the server and client side)
- Make pagination details configurable
- Multi-select with multi-delete, bulk-edit?
- expand scaffold option to see a larger data set
