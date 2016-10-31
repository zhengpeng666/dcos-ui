/*
  This code is a reimplemenation of graphql-relay-js.
  graphql-relay-js relies on graphql-js which we do not want.

  https://github.com/graphql/graphql-relay-js/blob/master/src/connection/arrayconnection.js
 */

// Prefix for cursor string.
const PREFIX = 'cursor:';

/**
 * A simple function that accepts an array and connection arguments, and returns
 * a connection object for use in GraphQL. It uses array offsets as pagination,
 * so pagination will only work if the array is static. Relies on server data
 * maintaining order.
 */
export function Paginate(data, args) {
  if (!Array.isArray(data) && typeof data.then === 'function') {
    return connectionFromPromisedArray(data, args);
  }

  return connectionFromArraySlice(
    data,
    args,
    {
      sliceStart: 0,
      arrayLength: data.length,
    }
  );
}

/**
 * A version of `connectionFromArray` that takes a promised array, and returns a
 * promised connection.
 */
export function connectionFromPromisedArray(dataPromise, args) {
  return dataPromise.then(data => {
    return connectionFromArraySlice(
      data,
      args,
      {
        sliceStart: 0,
        arrayLength: data.length,
      }
    );
  });
}

/**
 * Given a slice (subset) of an array, returns a connection object for use in
 * GraphQL.
 *
 * This function is similar to `connectionFromArray`, but is intended for use
 * cases where you know the cardinality of the connection, consider it too large
 * to materialize the entire array, and instead wish pass in a slice of the
 * total result large enough to cover the range specified in `args`.
 */
export function connectionFromArraySlice(arraySlice, args, meta) {
  const {after, before, first, last} = args;
  const {sliceStart, arrayLength} = meta;
  const sliceEnd = sliceStart + arraySlice.length;
  const beforeOffset = getOffsetWithDefault(before, arrayLength);
  const afterOffset = getOffsetWithDefault(after, -1);

  let startOffset = Math.max(
    sliceStart - 1,
    afterOffset,
    -1
  ) + 1;
  let endOffset = Math.min(
    sliceEnd,
    beforeOffset,
    arrayLength
  );
  if (typeof first === 'number') {
    if (first < 0) {
      throw new Error('Argument "first" must be a non-negative integer');
    }

    endOffset = Math.min(
      endOffset,
      startOffset + first
    );
  }
  if (typeof last === 'number') {
    if (last < 0) {
      throw new Error('Argument "last" must be a non-negative integer');
    }

    startOffset = Math.max(
      startOffset,
      endOffset - last
    );
  }

  // If supplied slice is too large, trim it down before mapping over it.
  const slice = arraySlice.slice(
    Math.max(startOffset - sliceStart, 0),
    arraySlice.length - (sliceEnd - endOffset)
  );

  const edges = slice.map((value, index) => ({
    cursor: offsetToCursor(startOffset + index),
    node: value,
  }));

  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];
  const lowerBound = after ? (afterOffset + 1) : 0;
  const upperBound = before ? beforeOffset : arrayLength;

  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage:
        typeof last === 'number' ? startOffset > lowerBound : false,
      hasNextPage:
        typeof first === 'number' ? endOffset < upperBound : false,
    },
  };
}

/**
 * Creates the cursor string from an offset.
 */
export function offsetToCursor(offset) {
  return PREFIX + offset;
}

/**
 * Rederives the offset from the cursor string.
 */
export function cursorToOffset(cursor) {
  return parseInt(cursor.substring(PREFIX.length), 10);
}

/**
 * Return the cursor associated with an object in an array.
 */
export function cursorForObjectInConnection(data, object) {
  const offset = data.indexOf(object);
  if (offset === -1) {
    return null;
  }

  return offsetToCursor(offset);
}

/**
 * Given an optional cursor and a default offset, returns the offset
 * to use; if the cursor contains a valid offset, that will be used,
 * otherwise it will be the default.
 */
export function getOffsetWithDefault(cursor, defaultOffset) {
  if (typeof cursor !== 'string') {
    return defaultOffset;
  }
  const offset = cursorToOffset(cursor);

  return isNaN(offset) ? defaultOffset : offset;
}
