import RAMLUtil from './utils/RAMLUtil';

class GeneratorContext {

  constructor() {
    this.constantTables = {};
    this.typesProcessed = {};
    this.typesQueue = [];
  }

  /**
   * This function marks the given type as `required`, scheduling a validator
   * function to ge generated for it.
   *
   * This function returns a string with the expression that represents the
   * way to call the generated (or will be generated) function.
   *
   * @param {ITypeDefinition} itype - The run-time RAML type to generate a validator for
   * @returns {String} - Returns the function javascript source
   */
  uses(itype) {
    let ref = RAMLUtil.getTypeRef(itype);

    if (!this.typesProcessed[ref]) {
      this.typesQueue.push(itype);
      this.typesProcessed[ref] = true;
    }

    return ref;
  }

  /**
   * Shift the next type in the type queue
   */
  nextTypeInQueue() {
    return this.typesQueue.shift();
  }

  /**
   * @param {String} tableName
   * @param {String} name
   * @param {String} value
   */
  getConstantString(tableName, name, value) {
    if (this.constantTables[tableName] == null) {
      this.constantTables[tableName] = {};
    }

    if (this.constantTables[tableName][name] == null) {
      this.constantTables[tableName][name] = JSON.stringify(value);
    }

    // Return constant name
    return `${tableName}.${name}`;
  }

  getConstantExpression(tableName, expression) {
    if (this.constantTables[tableName] == null) {
      this.constantTables[tableName] = [];
    }

    let index = this.constantTables[tableName].indexOf(expression);
    if (index === -1) {
      index = this.constantTables[tableName].length;
      this.constantTables[tableName].push(expression);
    }

    return `${tableName}[${index}]`;
  }

}

module.exports = GeneratorContext;
