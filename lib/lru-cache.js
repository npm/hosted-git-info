'use strict'

class LRUCache {
  #max = 1000
  #map = new Map()

  has (key) {
    return this.#map.has(key)
  }

  clear () {
    this.#map.clear()
  }

  get (key) {
    const value = this.#map.get(key)
    if (value === undefined) {
      return undefined
    }

    // Remove the key from the map and add it to the end
    this.#map.delete(key)
    this.#map.set(key, value)
    return value
  }

  set (key, value) {
    const deleted = this.#map.delete(key)

    if (deleted || value === undefined) {
      return
    }

    // If cache is full, delete the least recently used item
    if (this.#map.size >= this.#max) {
      const [firstKey] = this.#map.keys()
      this.#map.delete(firstKey)
    }

    this.#map.set(key, value)
  }
}

module.exports = { LRUCache }
