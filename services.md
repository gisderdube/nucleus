# How services work:

an example service file looks like this:

```
const moment = require('moment')

const service = ({ fail, someString, someNumber }, identity) => {
    if (fail) throw new Error('some different error')
    console.log(someString)
    console.log(someNumber)

    return { success: true }
}

module.exports = {
    service, // the service function with the actual logic
    schema: { // a schema for the incoming data
        fail: 'Boolean',
        someString: {
            _type: 'String',
            _enum: ['somestring', 'anotherpossiblestring'],
            _sanitize: 'lowerCase|trim',
            _required: true,
            _maxLength: 10,
            _minLength: 4,
        },
        someNumber: {
            _type: 'Number',
            _min: 30,
            _max: 50,
        },
        someDate: {
            _type: 'Date',
            _after: moment.subtract(30, 'days'),
            _before: moment.add(50, 'days'),
        },
        someId: {
            _type: 'ObjectId',
            _required: true,
        },
    },
    open: true, // defines if the endpoint requires an identity or not
    system: false, // defines if it can only be called by the system
}
```

Your module has to export a module with the following object structure:

```
module.exports = {
    service,
    schema,
    open,
    system,
}
```

## `service`

is the actual function that contains most of your logic. Here you can query the db, modify data etc. The function takes the arguments `(data, identity)`.

### `data`

You can expect the data to be in the format defined in schema (see below).

### `identity`

Represents a user in form of a decoded jwt (meaning it doesnt contain any sensitive data).

### Error handling

Is done by simply doing:

```
const err = new Error('some more detailed description or additional info')
err.code = 'SOME_ERROR_CODE'
throw err
```

OR

```
throw new Error('some description)
```

If no code is specified or the code is unknown, the error will be handled as internal server error.

## `schema`

Is an object with keys representing the incoming data. All additional data coming in will be removed. You have multiple further options to prevalidate and trim incoming data. This saves you manual validation and data modification.

Schema properties are prefixed with a `_`. This makes it easier to differentiate schema properties from data keys. Additionally, we prevent any name collisions with data key declaration. The known properties are:

```
...
schema: {
    _array,
    _type,
    _sanitize,
    _required,
    _enum,
    _min,
    _max,
    _before,
    _after,
    _regex,
    _minLength,
    _maxLength,
    _minSize,
    _maxSize,
}
...
```

### `_type`

can be one of `Boolean|String|Number|Date|ObjectId|Email|File|Mixed`. You can either specify it as type field:

```
...
schema: {
    someBoolData: {
        type: 'Boolean'
    }
}
...
```

OR directly as value of the property, if you don't need to specify other options

```
...
schema: {
    someBoolData: 'Boolean'
}
...
```

### `_sanitize`

This can be used to transform clean up the incoming data before using it. Current usecases are for String only and can be used as followed
`_sanitize: 'operation1|operation2'`, where the operations are being executed successively. Possible operations are `capitalize|lowerCase|upperCase|removeSpaces|trim`.

IMPORTANT: The sanitizer actually runs after the validation specified in the options below.

#### Email

Will be automatically be sanitized with `removeSpaces|lowerCase`.

#### ObjectId

Will be converted into a String.

#### Date

Will be converted into a moment object.

#### File

You can send Files with FormData to the services. To retrieve files correctly, set the \_type to `File` in the schema, for example:

```
...
schema: {
    my_file: 'File'
}
...
```

You can also restrict the file size of the incoming file (see below). If you want to test the file services, you have to pass an object with the following fields:

```
    name: 'edtr tablet test.pdf',
    data: <Buffer ... >,
    size: 9510088,
    mimetype: 'application/pdf',
    md5: 'b4c14169a0ee231f1d7cd7d92d2eb27a',
```

You can simply put fake values in.

FormData only supports one level depth, meaning you cannot nest objects when sending files. However, Booleans, Numbers and Dates will be parsed.

### `_required`

If `true`, throws an error if the property is not existent

### `_enum`

Will check if the incoming data matches one of the elements in the enum array. If not, throws an error.

Example:

```
...
{
    type: 'String',
    enum: ['someString', 'anotherAllowedString']
}
...
```

### `_min` (Number only)

Means that the incoming Number has to be equal or greater than the specified `min` value.

### `_max` (Number only)

Means that the incoming Number has to be equal or smaller than the specified `max` value.

Example:

```
...
{
    type: 'Number',
    min: 10,
    max: 50,
}
...
```

### `_before` (Date only)

Type Date only. Means that the incoming Date has to be before the specified `before` value. You can pass either a JS `Date()` object, or a `moment()`

### `_after` (Date only)

Type Date only. Means that the incoming Date has to be after the specified `after` value. You can pass either a JS `Date()` object, or a `moment()`

Example:

```
...
{
    type: 'Date',
    after: moment().subtract(30, 'days),
    before: new Date(),
}
...
```

### `_regex` (String only)

You can pass a regex here that the incoming String will be tested against. If it doesn't match, returns an error.

Example:

```
...
{
    type: 'String',
    regex: /^[a-z]+$/,
}
...
```

### `_minLength` (String only)

Declares a minimun length for the string.

### `_maxLength` (String only)

Declares a maximum length for the string.

Example:

```
...
{
    type: 'String',
    minLength: 4,
    maxLength: 8,
}
...
```

### `_maxSize` (File only)

Declares a maximum size (in bytes) for the incoming file

### `_minSize` (File only)

Declares a minimum size (in bytes) for the incoming file

## `open`

Defaults to `false`. If `true`, the endpoint is open for everybody to call it, meaning that you do not need to be signed in to call it.

## `system`

Defaults to `false`.

## Nested declarations

The system fully supports nested declarations to any level of depth. Simply add your properties without the `_`-prefix. You probably do not want to specify any system options inside the nested object, just to avoid confusion. Exceptions to this rule are the `_required` and the `_array` option. See below for more info.

Example:

```
...
schema: {
    address: {
        street: 'String',
        number: {
            _type: 'Number',
            _min: 1,
        },
    },
}
...
```

**Bad** Example:

```
...
schema: {
    address: {
        _type: 'String', // does not make sense, since it is an object
        street: 'String',
        number: {
            _type: 'Number',
            _min: 1,
        },
    },
}
...
```

## Arrays

Simply set the `_array` property to true and the system accepts arrays with the same declaration. All the validation and transformation steps will of course still be applied to all elements in the array.

Example:

```
...
schema: {
    names: {
        _type: 'String',
        _array: true,
    },
}
...


// incoming data
{
    names: ['Mario', 'Luigi', 'Bowser'],
}
```

Another Example (with nested declarations):

```
...
schema: {
    addresses: {
        _array: true,
        street: 'String',
        number: 'Number',
    },
}
...


// incoming data
{
    addresses: [
        {
            street: 'Hauptstraße',
            number: 52,
        },
        {
            street: 'Bismarckstraße',
            number: 19,
        },
    ],
}
```
