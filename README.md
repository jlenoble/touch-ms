# touch-ms

Touch, asynchronous and with millisecond granularity

  * [Usage](#usage)
  * [License](#license)


## Usage

A minimal helper to update asynchronously the `mtime` and `atime` of an *existing* file with the current date at millisecond granularity.

```js
import touchMs from 'touch-ms';

touchMs('path/to/file'); // Returns a promise resolving to the new stats
```

## License

touch-ms is [MIT licensed](./LICENSE).

© 2017 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
