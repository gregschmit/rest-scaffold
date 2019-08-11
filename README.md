# REST-Scaffold.js

![npm](https://img.shields.io/npm/v/rest-scaffold)

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

If you're using a tool like
[`django-rest-scaffolds`](https://github.com/gregschmit/django-rest-scaffold)
to generate all this, then the tool can escape the quotes in the JSON.
Otherwise, using single quotes for the property is helpful.

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

`apiType` (string, default: `"plain"`) : This defines the structure of the API
that we are interacting with. `plain` indicates that a listing should return a
JSON list with no pagination. If you use Django with the Rest Framework
paginator, then you should put `django-paged`. This is a shortcut configuration
option and the individual attributes that this affects can all be edited
selectively.

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

`isPaged` (boolean, default: `false`): Whether the API listing returns results
in a paged format.

`rawCreateForm` (string, default: `null`): The HTML create form.

`rawUpdateForm` (string, default: `null`): The HTML update form.

`recordTitle` (string, default: `"Record"`): The name for a single record.
