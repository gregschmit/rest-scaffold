# REST Scaffold

![npm](https://img.shields.io/npm/v/rest-scaffold)

REST Scaffold is a frontend application for building table-based user interfaces (called scaffolds)
that interact with RESTful JSON APIs.

## How It Works

The basic idea is that you have some API at `https://example.com/api/thing` and
you provide a `div` with a `data-rest-scaffold` property which is a
configuration in the form of a JSON, like:

```json
{
  "url": "https://example.com/api/things",
  "title": "Things",
  "subtitle": "that go in the kitchen",
  "recordTitle": "Thing",
  "pkField": "id",
  "csrfToken": "blahblah"
}
```

You can also select an `apiType` that support autoconfiguration with an `OPTIONS` preflight request.

```json
{
  "url": "https://example.com/api/things",
  "apiType": "rrf"
}
```

The `div` would look like this:

```html
<div
  data-rest-scaffold='{
  "url": "https://example.com/api/things",
  "apiType": "rrf",
}'
></div>
```

The library will assume the following endpoints exist:

- `GET`->`things` A listing of the objects
- `POST`->`things` A creation of a single object
- `GET`->`things/pk` A retrieval of a single object
- `PUT`->`things/pk` A update of a single object
- `DELETE`->`things/pk` A deletion of a single object

## CDN Links

https://cdn.jsdelivr.net/npm/rest-scaffold/dist/rest-scaffold.js

https://cdn.jsdelivr.net/npm/rest-scaffold/dist/rest-scaffold.css

## Configuration Options

### Common Options

`url` (`string`, default: `"/"`): The url that we should use to access the REST API.

`apiType` (`string`, default: `"plain"`): Defines the type of API we are interacting with. `"plain"
provides very little functionality and doesn't attempt an `OPTIONS`preflight request.`"rrf"`is
for using Rails REST Framework, and assumes an`OPTIONS` verb is available to get API metadata.

While not implemented yet, `"drf"` is also planned for using Django REST Framework, and would also
depend on the `OPTIONS` verb being available to get API metadata.

`title` (`string`, default: `""`): The main bold text shown at the top of the scaffold.

`subtitle` (`string`, default: `""`): Lighter text shown after the title at the top of the scaffold.

`csrfToken` (`string`, default: `""`): Cross-Site Request Forgery token to use during `POST`, `PUT`,
and `DELETE` requests.

`debug` (`boolean`, default: `true`): Whether debugging information (including
request payload) should be displayed in scaffold error messages.

`fields` (`string[] | null`, default: `[]`): The fields that we should expect. If this is
falsy, then the scaffold will try to infer them from a listing.

`pkField` (`string`, default: `"id"`): The field that we can use as a primary
key.

### Other Options

`actionsLabel` (`string`, default: `"."`): The label for the actions column in
the scaffold.

`csrfTokenHeader` (`string`, default: `"X-CSRFToken"`): The HTTP header for
passing the CSRF Token.

`isPaged` (`boolean`, default: `false`): Whether the API listing returns results
in a paged format.

`recordTitle` (`string`, default: `"Record"`): The name for a single record.

## Development

To build:

```sh
npm run-script build
```

To run prettier code formatter:

```sh
npm run-script format
```

To run dev server:

```sh
npm run-script dev
```
