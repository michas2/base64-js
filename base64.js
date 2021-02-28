class Base64Transformer {
  constructor() {
    this.extra = "";
  }

  transform(chunk, controller) {
    console.log("transform");
    console.log(chunk);
    chunk = this.extra + chunk.replace(/(\r\n|\n|\r)/gm, '');

    // 4 characters represent 3 bytes, so we can only decode in groups of 4 chars
    const remaining = chunk.length % 4;

    // Store the extra chars for later
    this.extra = chunk.slice(chunk.length - remaining);
    chunk = chunk.slice(0, chunk.length - remaining);
    //console.log("atob: '%o'",chunk);
    controller.enqueue(atob(chunk));
  }

  flush(controller) {
    if (this.extra.length > 0) {
      console.error("data left: '%o'", this.extra);
    }
  }
}
