export const LOCALSTORAGE_KEY = "anydown_items_002";
export const LOCALSTORAGE_LAST_EDITED_FILE = "anydown_last_edited_file";
import { example } from "./example.js";

//TODO 作成日・更新日を追加

export function generateRandomId() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

export class LocalDb {
  constructor() {
    this.cache = [];
  }

  upsert(key, name, contents) {
    const found = this.read(key);
    if (found) {
      this.update(key, name, contents);
    } else {
      this.insert(name, contents);
    }
  }

  insert(name, contents) {
    const id = generateRandomId();
    const timestamp = new Date().getTime();
    this.cache.push({
      key: id,
      name: name,
      contents: contents,
      updated_at: timestamp,
      created_at: timestamp
    });
    return id;
  }

  update(key, name, contents) {
    const found = this.read(key);
    found.contents = contents;
    found.name = name;
    found.updated_at = new Date().getTime();
  }

  read(key) {
    return this.cache.find(item => item.key === key);
  }

  delete(key) {
    const index = this.cache.findIndex(item => item.key === key);
    this.cache.splice(index, 1);
  }

  save() {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.cache));
  }

  load() {
    this.cache = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));
    if (!this.cache || this.cache.length === 0) {
      this.cache = [];
      this.insert("default", example);
    }
  }
}
