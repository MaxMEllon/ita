class Todo {
  constructor({ id, progress, title }) {
    this._id = id;
    this._progress = progress;
    this._title = title;
  }

  get id() {
    return this._id;
  }

  get progress() {
    return this._progress;
  }

  get percent() {
    return `${this.progress * 100}%`;
  }

  get title() {
    return this._title;
  }

  get blockCount() {
    return Math.floor(this.progress * 20);
  }

  get color() {
    const { progress } = this;
    switch (true) {
      case (progress === 0):
        return { red: true };
      case (progress < 1):
        return { yellod: true };
      case (progress === 1):
        return { green: true };
      default:
        return { blue: true };
    }
  }

  static find(id, list) {
    const result = list.filter(i => i.id === id)
    if (result === []) return null;
    return result[0];
  }
}

module.exports = Todo;
