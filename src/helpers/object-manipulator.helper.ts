/**
 * Object manipulation utilities that extend the native Object prototype.
 *
 * This module provides instance methods for common object manipulation tasks
 * while ensuring type safety, immutability principles, and proper error handling.
 *
 * @remarks
 * The `exclude` method follows immutability principles by creating and returning a new object
 * rather than modifying the original. The `delete` method mutates the original object.
 * All methods include comprehensive input validation and meaningful error messages.
 *
 * @example Basic Usage
 * ```typescript
 * const user = { id: 1, name: 'John', email: 'john@example.com', temp: true };
 *
 * // Create a new object excluding specified keys
 * const cleanUser = user.exclude(['temp']);
 * console.log(cleanUser); // { id: 1, name: 'John', email: 'john@example.com' }
 *
 * // Delete properties from the original object
 * user.delete(['temp']);
 * console.log(user); // { id: 1, name: 'John', email: 'john@example.com' }
 * ```
 *
 * @author dr.glasdou
 * @version 2.0.0
 * @since 1.0.0
 * @public
 * @namespace Helpers
 */

// Extend Object prototype to add instance methods
declare global {
  interface Object {
    exclude<T extends object>(this: T, keys: (keyof T)[]): Partial<T>;
    delete<T extends object>(this: T, keys: (keyof T)[]): void;
  }
}

Object.prototype.exclude = function <T extends object>(this: T, keys: (keyof T)[]): Partial<T> {
  // Input validation
  if (!this || typeof this !== 'object') {
    throw new TypeError('Invalid object provided for exclusion. Expected a non-null object.');
  }

  if (!Array.isArray(keys)) {
    throw new TypeError('Keys parameter must be an array of property keys.');
  }

  // Use Set for efficient O(1) key lookup performance
  const keysToExclude = new Set(keys);

  // Build new object excluding specified keys
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(this)) {
    if (!keysToExclude.has(key as keyof T)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      result[key] = value;
    }
  }

  return result as Partial<T>;
};

Object.prototype.delete = function <T extends object>(this: T, keys: (keyof T)[]): void {
  if (!this || typeof this !== 'object') {
    console.warn('Invalid object provided for deletion');
    return;
  }

  keys.forEach((key) => {
    if (!(key in this)) {
      console.warn(`Property ${String(key)} does not exist on the object.`);
      return;
    }

    try {
      delete this[key];
    } catch (error) {
      console.error(`Failed to delete property ${String(key)}:`, error);
    }
  });
};

export {};
